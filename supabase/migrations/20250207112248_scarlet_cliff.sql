/*
  # Fix assessment answers table structure

  1. Changes
    - Add unique constraint for user_id and question_id
    - Add additional_info column
    - Update indexes for better performance

  2. Security
    - Maintain existing RLS policies
*/

-- First, add the additional_info column
ALTER TABLE assessment_answers
ADD COLUMN IF NOT EXISTS additional_info text;

-- Add unique constraint for user_id and question_id
ALTER TABLE assessment_answers
DROP CONSTRAINT IF EXISTS assessment_answers_user_question_unique;

ALTER TABLE assessment_answers
ADD CONSTRAINT assessment_answers_user_question_unique 
UNIQUE (user_id, question_id);

-- Update indexes for better performance
DROP INDEX IF EXISTS idx_assessment_answers_user_session;

CREATE INDEX IF NOT EXISTS idx_assessment_answers_user_question
ON assessment_answers(user_id, question_id);

-- Update the updated_at trigger
CREATE OR REPLACE TRIGGER update_assessment_answers_updated_at
    BEFORE UPDATE ON assessment_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
