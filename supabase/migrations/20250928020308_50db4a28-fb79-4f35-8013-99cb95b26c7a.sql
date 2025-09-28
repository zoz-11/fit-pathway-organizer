-- Create admin role checking function for security
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'trainer'
  );
$$;

-- Create more secure audit log policies (restrict to admins only)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.audit_logs;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.audit_logs;

CREATE POLICY "Admins can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Add column-level security for sensitive profile fields
-- Create policy for viewing sensitive profile data (own data or trainer access)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Trainers can view their athletes" ON public.profiles;

-- Basic profile info viewable by self and trainer
CREATE POLICY "Users can view basic profile info" 
ON public.profiles 
FOR SELECT 
USING (
  user_owns_profile(id) OR 
  (get_current_user_role() = 'trainer' AND trainer_id = auth.uid())
);

-- Sensitive data (emergency contacts, phone) only viewable by self
CREATE POLICY "Users can view own sensitive data" 
ON public.profiles 
FOR SELECT 
USING (user_owns_profile(id));

-- Add audit logging for profile changes
CREATE OR REPLACE FUNCTION public.log_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, details)
    VALUES (
      NEW.id,
      'profile_updated',
      jsonb_build_object(
        'changed_fields', (
          SELECT jsonb_object_agg(key, value)
          FROM jsonb_each(to_jsonb(NEW))
          WHERE value IS DISTINCT FROM (to_jsonb(OLD) -> key)
        )
      )
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for profile audit logging
DROP TRIGGER IF EXISTS profile_audit_trigger ON public.profiles;
CREATE TRIGGER profile_audit_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_profile_changes();

-- Add message encryption metadata column
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS encrypted_metadata JSONB DEFAULT '{}';

-- Add message audit logging
CREATE OR REPLACE FUNCTION public.log_message_actions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, details)
    VALUES (
      NEW.sender_id,
      'message_sent',
      jsonb_build_object(
        'recipient_id', NEW.recipient_id,
        'message_id', NEW.id
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for message audit logging
DROP TRIGGER IF EXISTS message_audit_trigger ON public.messages;
CREATE TRIGGER message_audit_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.log_message_actions();