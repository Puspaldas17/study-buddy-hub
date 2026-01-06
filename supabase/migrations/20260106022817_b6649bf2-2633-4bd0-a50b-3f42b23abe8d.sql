-- Fix 1: Add DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile"
ON public.profiles FOR DELETE
USING (auth.uid() = user_id);

-- Fix 2: Update handle_new_user to sanitize input
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  sanitized_name TEXT;
BEGIN
  -- Sanitize and validate full_name (limit to 255 chars, trim whitespace)
  sanitized_name := TRIM(SUBSTRING(NEW.raw_user_meta_data ->> 'full_name', 1, 255));
  
  -- Only set full_name if it's valid
  IF sanitized_name IS NOT NULL AND LENGTH(sanitized_name) > 0 THEN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, sanitized_name);
  ELSE
    INSERT INTO public.profiles (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;