/*
  # Fix Reports RLS Policy

  1. Changes
    - Drop existing policies
    - Create new simplified policy matching assessment_answers approach
    - Add performance optimized indexes
  
  2. Security
    - Enable RLS
    - Allow access based on user ID or session ID
    - Ensure authenticated access only
*/

-- Drop existing policies safely
DROP POLICY IF EXISTS "reports_access_policy_v2" ON reports;
DROP POLICY IF EXISTS "reports_access_policy" ON reports;
DROP POLICY IF EXISTS "Users can read own reports" ON reports;
DROP POLICY IF EXISTS "Users can insert own reports" ON reports;

-- Create new simplified policy with a unique name
CREATE POLICY "reports_access_v3"
ON reports
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
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Recreate optimized indexes
DROP INDEX IF EXISTS idx_reports_user_lookup_v2;

CREATE INDEX idx_reports_user_lookup_v3
ON reports(user_id, created_at DESC);
