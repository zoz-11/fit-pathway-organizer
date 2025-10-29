-- Fix the handle_new_user function to resolve signup database errors
-- This addresses the "Database error saving new user" issue

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function with proper error handling and type casting
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _full_name TEXT;
  _role public.user_role;
  _email TEXT;
BEGIN
  -- Extract and validate metadata
  _email := COALESCE(NEW.email, '');
  _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'User');
  
  -- Safely cast role with fallback to 'athlete'
  BEGIN
    _role := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'athlete'::public.user_role);
  EXCEPTION WHEN OTHERS THEN
    _role := 'athlete'::public.user_role;
  END;

  -- Validate full_name (optional - can be removed if you want to allow empty names)
  IF _full_name IS NULL OR _full_name = '' THEN
    _full_name := 'User';
  END IF;

  -- Insert into profiles with error handling
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (
      NEW.id,
      _email,
      _full_name,
      _role,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      updated_at = NOW();
      
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    -- Re-raise if it's a critical error
    IF SQLERRM NOT LIKE '%duplicate key%' THEN
      RAISE;
    END IF;
  END;

  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add a comment for documentation
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile when a new user signs up. Includes error handling to prevent signup failures.';