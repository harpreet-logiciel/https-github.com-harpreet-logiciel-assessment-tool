/*
  # Fix RLS policies for assessment answers

  1. Changes
    - Drop existing policies
    - Create new simplified policy for assessment answers
    - Add helper function for session validation
    - Add necessary indexes for performance

  2. Security
    - Enable RLS
    - Add policy for authenticated users
    - Allow access based on session ID
*/

-- Drop existing policies
DROP POLICY IF EXISTS "session_based_access" ON assessment_answers;
DROP POLICY IF EXISTS "Allow assessment access" ON assessment_answers;

-- Create a new simplified policy
CREATE POLICY "assessment_access_policy"
ON assessment_answers
FOR ALL
USING (
  -- Allow access if:
  -- 1. User is authenticated AND
  -- 2. Either owns the record directly OR is part of the same session
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR
    user_id IN (
      SELECT id FROM users
      WHERE session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
      )
    )
  )
)
WITH CHECK (
  -- Same conditions for insert/update
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR
    user_id IN (
      SELECT id FROM users
      WHERE session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
      )
    )
  )
);

-- Helper function to validate session access
CREATE OR REPLACE FUNCTION check_session_access(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id
    AND (
      id = auth.uid() OR
      session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
      )
    )
  );
END;
$$;

-- Ensure RLS is enabled
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_session_lookup_v2
ON users(id, session_id, is_anonymous)
WHERE is_anonymous = true;

CREATE INDEX IF NOT EXISTS idx_assessment_answers_user_lookup_v2
ON assessment_answers(user_id, created_at DESC);
