-- Create RPC function for secure attendance session creation with server-side validation
CREATE OR REPLACE FUNCTION public.create_attendance_session(
  p_class_name TEXT,
  p_duration_minutes INTEGER DEFAULT 5
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_sanitized_class_name TEXT;
  v_session_code TEXT;
  v_expires_at TIMESTAMP WITH TIME ZONE;
  v_session_id UUID;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Validate class name is not empty
  IF p_class_name IS NULL OR TRIM(p_class_name) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Class name is required');
  END IF;
  
  -- Sanitize class name: trim, limit to 100 chars
  v_sanitized_class_name := TRIM(SUBSTRING(p_class_name, 1, 100));
  
  -- Validate class name format: only alphanumeric, spaces, hyphens, underscores
  IF NOT v_sanitized_class_name ~ '^[a-zA-Z0-9\s\-_]+$' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Class name can only contain letters, numbers, spaces, hyphens and underscores');
  END IF;
  
  -- Validate duration (1-60 minutes)
  IF p_duration_minutes < 1 OR p_duration_minutes > 60 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Duration must be between 1 and 60 minutes');
  END IF;
  
  -- Generate unique session code on server side
  -- Format: ATTEND-{sanitized_class_name}-{random_6_chars}-{timestamp}
  v_session_code := 'ATTEND-' || 
    REPLACE(v_sanitized_class_name, ' ', '-') || '-' ||
    UPPER(SUBSTRING(md5(random()::text || clock_timestamp()::text), 1, 6)) || '-' ||
    EXTRACT(EPOCH FROM clock_timestamp())::BIGINT;
  
  -- Calculate expiration time
  v_expires_at := clock_timestamp() + (p_duration_minutes || ' minutes')::INTERVAL;
  
  -- Insert the session
  INSERT INTO public.attendance_sessions (
    creator_id,
    class_name,
    session_code,
    expires_at,
    is_active
  ) VALUES (
    v_user_id,
    v_sanitized_class_name,
    v_session_code,
    v_expires_at,
    true
  )
  RETURNING id INTO v_session_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'session_id', v_session_id,
    'session_code', v_session_code,
    'class_name', v_sanitized_class_name,
    'expires_at', v_expires_at,
    'duration_minutes', p_duration_minutes
  );
  
EXCEPTION
  WHEN unique_violation THEN
    -- If session code collision (extremely rare), retry
    RETURN jsonb_build_object('success', false, 'error', 'Please try again');
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', 'Failed to create session');
END;
$$;