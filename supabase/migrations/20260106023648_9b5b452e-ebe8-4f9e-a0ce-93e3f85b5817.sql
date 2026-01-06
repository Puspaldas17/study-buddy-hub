-- Create attendance_sessions table for server-side QR code validation
CREATE TABLE public.attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  class_name TEXT NOT NULL,
  session_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Add constraint for session_code length
ALTER TABLE public.attendance_sessions 
ADD CONSTRAINT session_code_length CHECK (char_length(session_code) <= 100);

-- Add constraint for class_name length
ALTER TABLE public.attendance_sessions 
ADD CONSTRAINT class_name_length CHECK (char_length(class_name) <= 100);

-- Enable RLS
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to create attendance sessions
CREATE POLICY "Users can create attendance sessions"
ON public.attendance_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);

-- Allow session creators to view their own sessions
CREATE POLICY "Users can view their own sessions"
ON public.attendance_sessions FOR SELECT
TO authenticated
USING (auth.uid() = creator_id);

-- Allow session creators to update their own sessions
CREATE POLICY "Users can update their own sessions"
ON public.attendance_sessions FOR UPDATE
TO authenticated
USING (auth.uid() = creator_id);

-- Create function to validate attendance code and record attendance
CREATE OR REPLACE FUNCTION public.validate_and_record_attendance(
  p_attendance_code TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session RECORD;
  v_user_id UUID;
  v_existing_record UUID;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Validate input length
  IF char_length(p_attendance_code) > 100 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid attendance code');
  END IF;
  
  -- Check if valid, active, non-expired session exists
  SELECT id, class_name, expires_at, is_active
  INTO v_session
  FROM public.attendance_sessions
  WHERE session_code = p_attendance_code
  LIMIT 1;
  
  IF v_session.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid attendance code');
  END IF;
  
  IF NOT v_session.is_active THEN
    RETURN jsonb_build_object('success', false, 'error', 'This attendance session is no longer active');
  END IF;
  
  IF v_session.expires_at < now() THEN
    RETURN jsonb_build_object('success', false, 'error', 'This attendance session has expired');
  END IF;
  
  -- Check if user already recorded attendance for this session
  SELECT id INTO v_existing_record
  FROM public.attendance_records
  WHERE user_id = v_user_id AND attendance_code = p_attendance_code
  LIMIT 1;
  
  IF v_existing_record IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', true, 
      'already_recorded', true,
      'class_name', v_session.class_name,
      'message', 'You have already checked in for this session'
    );
  END IF;
  
  -- Insert attendance record
  INSERT INTO public.attendance_records (
    user_id, 
    attendance_code, 
    class_name, 
    status
  ) VALUES (
    v_user_id,
    p_attendance_code,
    v_session.class_name,
    'present'
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'already_recorded', false,
    'class_name', v_session.class_name,
    'message', 'Attendance recorded successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', 'Failed to record attendance');
END;
$$;