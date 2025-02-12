-- Drop existing policies
DROP POLICY IF EXISTS "Allow assessment access" ON assessment_answers;

-- Create a more permissive policy for assessment answers during the session
CREATE POLICY "session_based_access"
ON assessment_answers
FOR ALL
USING (
  -- Allow access if the user is authenticated and either:
  -- 1. Owns the record directly
  -- 2. Is part of the same session (for anonymous users)
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = assessment_answers.user_id
    AND (
      users.id = auth.uid()
      OR users.session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
      )
    )
  )
);

-- Ensure RLS is enabled
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;

-- Add function to get current session
CREATE OR REPLACE FUNCTION get_current_session_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT session_id 
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$;
