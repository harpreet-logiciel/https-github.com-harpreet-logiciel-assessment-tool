/*
  # Fix assessment answers RLS policies

  1. Changes
    - Drop existing assessment answers policies
    - Add new policies that properly handle anonymous users
    - Improve policy readability and performance
  
  2. Security
    - Allow anonymous users to manage their own answers
    - Maintain data isolation between users
    - Preserve session-based access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own answers" ON assessment_answers;
DROP POLICY IF EXISTS "Users can insert own answers" ON assessment_answers;
DROP POLICY IF EXISTS "Users can update own answers" ON assessment_answers;

-- Create new policies with better anonymous user handling
CREATE POLICY "Users can read own answers"
ON assessment_answers
FOR SELECT
USING (
  user_id IN (
    SELECT id FROM users 
    WHERE id = user_id 
    AND (
      -- Allow access if the user is the owner
      id = auth.uid()
      -- Or if it's an anonymous user from the same session
      OR (
        is_anonymous = true 
        AND session_id = (
          SELECT session_id FROM users WHERE id = auth.uid()
        )
      )
    )
  )
);

CREATE POLICY "Users can insert own answers"
ON assessment_answers
FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT id FROM users 
    WHERE id = user_id 
    AND (
      -- Allow insert if the user is the owner
      id = auth.uid()
      -- Or if it's an anonymous user from the same session
      OR (
        is_anonymous = true 
        AND session_id = (
          SELECT session_id FROM users WHERE id = auth.uid()
        )
      )
    )
  )
);

CREATE POLICY "Users can update own answers"
ON assessment_answers
FOR UPDATE
USING (
  user_id IN (
    SELECT id FROM users 
    WHERE id = user_id 
    AND (
      -- Allow update if the user is the owner
      id = auth.uid()
      -- Or if it's an anonymous user from the same session
      OR (
        is_anonymous = true 
        AND session_id = (
          SELECT session_id FROM users WHERE id = auth.uid()
        )
      )
    )
  )
)
WITH CHECK (
  user_id IN (
    SELECT id FROM users 
    WHERE id = user_id 
    AND (
      -- Allow update if the user is the owner
      id = auth.uid()
      -- Or if it's an anonymous user from the same session
      OR (
        is_anonymous = true 
        AND session_id = (
          SELECT session_id FROM users WHERE id = auth.uid()
        )
      )
    )
  )
);
