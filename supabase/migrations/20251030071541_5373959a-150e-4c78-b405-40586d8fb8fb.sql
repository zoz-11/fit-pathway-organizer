-- Task 1.4: Implement Audit Log Protection
-- Add explicit deny policies for DELETE and UPDATE on audit_logs

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Prevent audit log deletion" ON public.audit_logs;
DROP POLICY IF EXISTS "Prevent audit log updates" ON public.audit_logs;

-- Add explicit deny policies to prevent tampering with audit logs
CREATE POLICY "Prevent audit log deletion"
ON public.audit_logs
FOR DELETE
TO authenticated
USING (false);

CREATE POLICY "Prevent audit log updates"
ON public.audit_logs
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

-- Create audit log archive table for long-term storage
CREATE TABLE IF NOT EXISTS public.audit_logs_archive (
  id uuid PRIMARY KEY,
  user_id uuid,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL,
  archived_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on archive table
ALTER TABLE public.audit_logs_archive ENABLE ROW LEVEL SECURITY;

-- Only admins can view archived logs
CREATE POLICY "Only admins can view archived audit logs"
ON public.audit_logs_archive
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Prevent any modifications to archived logs
CREATE POLICY "Prevent archived log deletion"
ON public.audit_logs_archive
FOR DELETE
TO authenticated
USING (false);

CREATE POLICY "Prevent archived log updates"
ON public.audit_logs_archive
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

-- Create function for log rotation (archive logs older than 90 days)
CREATE OR REPLACE FUNCTION public.archive_old_audit_logs()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  archived_count integer;
BEGIN
  -- Move logs older than 90 days to archive
  WITH moved_logs AS (
    INSERT INTO public.audit_logs_archive (id, user_id, action, details, created_at)
    SELECT id, user_id, action, details, created_at
    FROM public.audit_logs
    WHERE created_at < (now() - interval '90 days')
    RETURNING id
  )
  SELECT count(*) INTO archived_count FROM moved_logs;
  
  -- Delete the archived logs from main table (only through this function)
  DELETE FROM public.audit_logs
  WHERE created_at < (now() - interval '90 days');
  
  RETURN archived_count;
END;
$$;

-- Add comment explaining the security model
COMMENT ON TABLE public.audit_logs IS 'Immutable audit trail. Logs older than 90 days are automatically archived.';
COMMENT ON TABLE public.audit_logs_archive IS 'Long-term archive of audit logs. Completely immutable.';
COMMENT ON FUNCTION public.archive_old_audit_logs() IS 'Securely archives audit logs older than 90 days. Should be run periodically via edge function.';