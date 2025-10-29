-- Migration to fix signup database error

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
    -- Safe casting with fallback
    NEW.role := COALESCE(NEW.role::public.user_role, 'athlete');
    NEW.full_name := COALESCE(NEW.full_name, 'User');

    -- Log warnings
    RAISE WARNING 'User role is set to %', NEW.role;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();