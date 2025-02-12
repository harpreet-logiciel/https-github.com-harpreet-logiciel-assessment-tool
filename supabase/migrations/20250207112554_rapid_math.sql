/*
  # Update assessment answers to use JSONB format

  1. Changes
    - Convert answer column to JSONB to support multiple answer types
    - Remove additional_info column as it will be part of the answer JSONB
    - Update indexes for JSONB querying

  2. Security
    - Maintain existing RLS policies
*/

-- First, create a temporary column for the new format
ALTER TABLE assessment_answers
ADD COLUMN answer_jsonb jsonb;

-- Update existing data to new format
UPDATE assessment_answers
SET answer_jsonb = jsonb_build_object(
  'value', answer,
  'additional_info', additional_info
)
WHERE answer IS NOT NULL;

-- Drop old columns
ALTER TABLE assessment_answers
DROP COLUMN IF EXISTS additional_info,
DROP COLUMN IF EXISTS answer;

-- Rename new column to answer
ALTER TABLE assessment_answers
RENAME COLUMN answer_jsonb TO answer;

-- Add GIN index for efficient JSONB querying
CREATE INDEX IF NOT EXISTS idx_assessment_answers_answer
ON assessment_answers USING GIN (answer);
