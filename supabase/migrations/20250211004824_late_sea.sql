/*
  # Fix Assessment Answers RLS Policy - Final Version

  1. Changes
    - Drop all existing policies
    - Create new simplified policy with no WITH CHECK clause
    - Add performance optimized indexes
  
  2. Security
    - Enable RLS
    - Allow access based on user ID or session ID
    - Ensure authenticated access only
*/

-- Drop all existing policies for assessment_answers
DROP POLICY IF EXISTS "assessment_answers_access_v7" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v6" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v5" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v4" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v3" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_access_policy" ON assessment_answers;
DROP POLICY IF EXISTS "session_based_access" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access" ON assessment_answers;

-- Create new simplified policy with no WITH CHECK clause
CREATE POLICY "assessment_answers_access_v8"
ON assessment_answers
FOR ALL
USING (
  -- Simple session-based access check
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = assessment_answers.user_id
    AND (
      users.id = auth.uid()
      OR users.session_id = (SELECT session_id FROM users WHERE id = auth.uid())
    )
  )
);

-- Ensure RLS is enabled
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;

-- Recreate optimized indexes
DROP INDEX IF EXISTS idx_assessment_answers_user_session_v4;
DROP INDEX IF EXISTS idx_users_session_lookup_v4;

CREATE INDEX idx_assessment_answers_user_session_v5
ON assessment_answers(user_id, created_at DESC);

CREATE INDEX idx_users_session_lookup_v5
ON users(id, session_id);
