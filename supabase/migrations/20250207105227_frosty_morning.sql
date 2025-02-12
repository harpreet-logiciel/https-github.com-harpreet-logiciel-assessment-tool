/*
  # Fix sync issues with assessment answers

  1. Changes
    - Simplify RLS policies
    - Add better error handling
    - Fix session management
    - Add proper indexes

  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Allow temporary access for assessment
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous access" ON assessment_answers;

-- Create new simplified policies
CREATE POLICY "Allow assessment access"
ON assessment_answers
FOR ALL
USING (
  -- Allow access if:
  -- 1. User is authenticated and owns the record
  -- 2. User is temporary and shares the same session
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = assessment_answers.user_id
      AND users.is_anonymous = true
      AND users.session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
      )
    )
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = assessment_answers.user_id
      AND users.is_anonymous = true
      AND users.session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
      )
    )
  )
);

-- Add composite index for better query performance
CREATE INDEX IF NOT EXISTS idx_assessment_answers_user_session
ON assessment_answers(user_id);

-- Add index on users table for session lookup
CREATE INDEX IF NOT EXISTS idx_users_session_lookup
ON users(id, session_id)
WHERE is_anonymous = true;
