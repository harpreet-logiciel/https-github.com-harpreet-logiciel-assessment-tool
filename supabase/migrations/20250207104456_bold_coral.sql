/*
  # Fix assessment answers RLS policies

  1. Changes
    - Drop existing RLS policies
    - Add simplified policies for anonymous users
    - Add proper session handling
  
  2. Security
    - Allow anonymous users to manage their own data
    - Maintain data isolation between sessions
    - Simplify policy conditions for better performance
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own answers" ON assessment_answers;
DROP POLICY IF EXISTS "Users can insert own answers" ON assessment_answers;
DROP POLICY IF EXISTS "Users can update own answers" ON assessment_answers;

-- Create new simplified policies
CREATE POLICY "Users can manage own answers"
ON assessment_answers
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = assessment_answers.user_id
    AND (
      users.id = auth.uid()
      OR users.session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
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
      OR users.session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
      )
    )
  )
);
