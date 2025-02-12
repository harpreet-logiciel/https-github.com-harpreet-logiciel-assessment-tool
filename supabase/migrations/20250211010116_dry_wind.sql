-- Drop existing policies
DROP POLICY IF EXISTS "assessment_answers_access_v10" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_read" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_insert" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_update" ON assessment_answers;

-- Create new permissive policy for assessment answers
CREATE POLICY "assessment_answers_public_access"
ON assessment_answers
FOR ALL
USING (true)
WITH CHECK (true);

-- Create permissive policy for reports
DROP POLICY IF EXISTS "reports_access_v4" ON reports;
CREATE POLICY "reports_public_access"
ON reports
FOR ALL
USING (true)
WITH CHECK (true);

-- Create permissive policy for users
DROP POLICY IF EXISTS "users_access" ON users;
CREATE POLICY "users_public_access"
ON users
FOR ALL
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled but permissive
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_answers_user_lookup
ON assessment_answers(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reports_user_lookup
ON reports(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_session_lookup
ON users(id, session_id);
