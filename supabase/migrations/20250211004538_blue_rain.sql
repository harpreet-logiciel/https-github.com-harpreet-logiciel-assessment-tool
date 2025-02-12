/*
  # Simplify Assessment Answers RLS Policy

  1. Changes
    - Drop existing policies
    - Create new simplified policy with direct session check
    - Add performance optimized indexes
  
  2. Security
    - Enable RLS
    - Allow access based on user ID or session ID
*/

-- Drop existing policies safely
DROP POLICY IF EXISTS "assessment_answers_access_v5" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v4" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v3" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_access_policy" ON assessment_answers;
DROP POLICY IF EXISTS "session_based_access" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access" ON assessment_answers;

-- Create new simplified policy with a unique name
CREATE POLICY "assessment_answers_access_v6"
ON assessment_answers
FOR ALL
USING (
  -- Simple check: either the user owns the record or shares the same session
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users u1
      WHERE u1.id = auth.uid() AND EXISTS (
        SELECT 1 FROM users u2
        WHERE u2.id = assessment_answers.user_id
        AND u2.session_id = u1.session_id
      )
    )
  )
)
WITH CHECK (
  -- Same simple check for writes
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users u1
      WHERE u1.id = auth.uid() AND EXISTS (
        SELECT 1 FROM users u2
        WHERE u2.id = assessment_answers.user_id
        AND u2.session_id = u1.session_id
      )
    )
  )
);

-- Ensure RLS is enabled
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;

-- Recreate optimized indexes
DROP INDEX IF EXISTS idx_assessment_answers_user_session;
DROP INDEX IF EXISTS idx_assessment_answers_user_session_v2;
DROP INDEX IF EXISTS idx_users_session_access;
DROP INDEX IF EXISTS idx_users_session_access_v2;

CREATE INDEX idx_assessment_answers_user_session_v3
ON assessment_answers(user_id);

CREATE INDEX idx_users_session_access_v3
ON users(id, session_id)
INCLUDE (is_anonymous);
