/*
  # Simplify Assessment Answers RLS Policy

  1. Changes
    - Drop existing policies
    - Create new simplified policy with more permissive access
    - Add performance optimized indexes
  
  2. Security
    - Enable RLS
    - Allow access based on user ID or session ID
    - Ensure authenticated access only
*/

-- Drop existing policies safely
DROP POLICY IF EXISTS "assessment_answers_access_v6" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v5" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v4" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access_v3" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_access_policy" ON assessment_answers;
DROP POLICY IF EXISTS "session_based_access" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_access" ON assessment_answers;

-- Create new simplified policy with a unique name
CREATE POLICY "assessment_answers_access_v7"
ON assessment_answers
FOR ALL
USING (
  -- Allow access if authenticated and either:
  -- 1. User owns the record directly
  -- 2. User is in the same session as the record owner
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

-- Ensure RLS is enabled
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;

-- Recreate optimized indexes
DROP INDEX IF EXISTS idx_assessment_answers_user_session_v3;
DROP INDEX IF EXISTS idx_users_session_access_v3;

CREATE INDEX idx_assessment_answers_user_session_v4
ON assessment_answers(user_id, created_at DESC);

CREATE INDEX idx_users_session_lookup_v4
ON users(id, session_id)
WHERE is_anonymous = true;
