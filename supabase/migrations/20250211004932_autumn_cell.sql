/*
  # Fix Assessment Answers RLS Policy - Final Version 3

  1. Changes
    - Drop all existing policies
    - Create separate policies for read and write operations
    - Add performance optimized indexes
  
  2. Security
    - Enable RLS
    - Allow access based on user ID or session ID
    - Explicit policies for different operations
*/

-- Drop all existing policies for assessment_answers
DROP POLICY IF EXISTS "assessment_answers_access_v9" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v8" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v7" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v6" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v5" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v4" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_access_policy" ON assessment_answers;
DROP POLICY IF EXISTS "session_based_access" ON assessment_answers;

-- Create separate policies for read and write operations
CREATE POLICY "assessment_answers_read"
ON assessment_answers
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM users
    WHERE id = assessment_answers.user_id
    AND session_id = (
      SELECT session_id FROM users WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "assessment_answers_insert"
ON assessment_answers
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM users
    WHERE id = assessment_answers.user_id
    AND session_id = (
      SELECT session_id FROM users WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "assessment_answers_update"
ON assessment_answers
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM users
    WHERE id = assessment_answers.user_id
    AND session_id = (
      SELECT session_id FROM users WHERE id = auth.uid()
    )
  )
)
WITH CHECK (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM users
    WHERE id = assessment_answers.user_id
    AND session_id = (
      SELECT session_id FROM users WHERE id = auth.uid()
    )
  )
);

-- Ensure RLS is enabled
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;

-- Recreate optimized indexes
DROP INDEX IF EXISTS idx_assessment_answers_user_session_v6;
DROP INDEX IF EXISTS idx_users_session_lookup_v6;

CREATE INDEX idx_assessment_answers_user_session_v7
ON assessment_answers(user_id, created_at DESC);

CREATE INDEX idx_users_session_lookup_v7
ON users(id, session_id);
