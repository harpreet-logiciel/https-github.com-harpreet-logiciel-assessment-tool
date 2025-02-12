/*
  # Update Reports Table RLS Policies

  1. Changes
    - Drop existing policies
    - Create new unified access policy for reports table
    - Add performance index
  
  2. Security
    - Enable RLS
    - Add policy for authenticated users to access their own reports
    - Allow access to reports within the same session
*/

-- First drop any existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Drop policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' 
    AND policyname = 'reports_access_policy'
  ) THEN
    DROP POLICY IF EXISTS "reports_access_policy" ON reports;
  END IF;
END $$;

-- Create new unified policy for reports
CREATE POLICY "reports_access_policy_v2"
ON reports
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

-- Ensure RLS is enabled
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Add index for better performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_reports_user_lookup_v2
ON reports(user_id, created_at DESC);
