/*
  # Add session_started_at to users table and fix RLS policies

  1. Schema Changes
    - Add session_started_at column to users table
    - Add indexes for better performance

  2. Security Updates
    - Update RLS policies for better anonymous user handling
    - Fix assessment_answers policies
*/

-- Add session_started_at to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS session_started_at timestamptz;

-- Update RLS policies for assessment_answers
DROP POLICY IF EXISTS "Allow assessment access" ON assessment_answers;

CREATE POLICY "Allow assessment access"
ON assessment_answers
FOR ALL
USING (
  -- Allow access if:
  -- 1. User is authenticated and owns the record
  -- 2. User is temporary and shares the same session
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = assessment_answers.user_id
    AND (
      users.id = auth.uid()
      OR (
        users.is_anonymous = true 
        AND users.session_id = (
          SELECT session_id FROM users WHERE id = auth.uid()
        )
      )
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = assessment_answers.user_id
    AND (
      users.id = auth.uid()
      OR (
        users.is_anonymous = true 
        AND users.session_id = (
          SELECT session_id FROM users WHERE id = auth.uid()
        )
      )
    )
  )
);

-- Add composite index for better query performance
CREATE INDEX IF NOT EXISTS idx_assessment_answers_user_lookup
ON assessment_answers(user_id, question_id);

-- Add index on users table for session lookup
CREATE INDEX IF NOT EXISTS idx_users_auth_lookup
ON users(id, session_id, is_anonymous);

-- Add index for reports lookup
CREATE INDEX IF NOT EXISTS idx_reports_lookup
ON reports(id, user_id);
