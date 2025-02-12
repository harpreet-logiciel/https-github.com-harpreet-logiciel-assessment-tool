/*
  # Fix Assessment Answers RLS Policy - Final Version 2

  1. Changes
    - Drop all existing policies
    - Create new permissive policy for all operations
    - Add performance optimized indexes
  
  2. Security
    - Enable RLS
    - Allow access based on user ID or session ID
    - Simplified policy structure
*/

-- Drop all existing policies for assessment_answers
DROP POLICY IF EXISTS "assessment_answers_access_v8" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v7" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v6" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v5" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v4" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v3" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_access_policy" ON assessment_answers;
DROP POLICY IF EXISTS "session_based_access" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access" ON assessment_answers;

-- Create new permissive policy
CREATE POLICY "assessment_answers_access_v9"
ON assessment_answers
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
  -- Allow access if user owns the record or shares the same session
  user_id = auth.uid() OR
  user_id IN (
    SELECT id FROM users
    WHERE session_id = (
      SELECT session_id FROM users WHERE id = auth.uid()
    )
  )
);

-- Ensure RLS is enabled
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;

-- Recreate optimized indexes
DROP INDEX IF EXISTS idx_assessment_answers_user_session_v5;
DROP INDEX IF EXISTS idx_users_session_lookup_v5;

CREATE INDEX idx_assessment_answers_user_session_v6
ON assessment_answers(user_id, created_at DESC);

CREATE INDEX idx_users_session_lookup_v6
ON users(id, session_id);
