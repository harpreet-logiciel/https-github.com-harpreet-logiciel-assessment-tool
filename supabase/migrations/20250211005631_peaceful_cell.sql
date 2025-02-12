-- Drop existing policies
DROP POLICY IF EXISTS "assessment_answers_access_v9" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_read" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_insert" ON assessment_answers;
DROP POLICY IF EXISTS "assessment_answers_update" ON assessment_answers;

-- Create new permissive policy for assessment answers
CREATE POLICY "assessment_answers_access_v10"
ON assessment_answers
FOR ALL
USING (true)
WITH CHECK (true);

-- Create permissive policy for reports
DROP POLICY IF EXISTS "reports_access_v3" ON reports;
CREATE POLICY "reports_access_v4"
ON reports
FOR ALL
USING (true)
WITH CHECK (true);

-- Create permissive policy for users
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Allow anonymous user creation" ON users;

CREATE POLICY "users_access"
ON users
FOR ALL
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled but permissive
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
