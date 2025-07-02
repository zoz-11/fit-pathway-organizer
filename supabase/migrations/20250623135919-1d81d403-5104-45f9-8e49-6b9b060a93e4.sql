
-- Remove the problematic recursive policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a security definer function to safely get user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create a security definer function to check if user owns profile
CREATE OR REPLACE FUNCTION public.user_owns_profile(profile_id UUID)
RETURNS BOOLEAN AS $$
  SELECT auth.uid() = profile_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create new non-recursive policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (public.user_owns_profile(id));

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (public.user_owns_profile(id));

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
