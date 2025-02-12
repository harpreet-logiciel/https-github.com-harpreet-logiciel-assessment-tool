/*
  # Assessment System Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `is_anonymous` (boolean, default true)
      - `session_id` (uuid)
      - `email` (text, nullable)
      - `name` (text, nullable)
      - `company` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `assessment_answers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `question_id` (text)
      - `answer` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `reports`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `preview_report` (jsonb)
      - `full_report` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for:
      - Users can read/update their own data
      - Anonymous access for initial creation
      - Secure access to assessment answers and reports
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_anonymous boolean DEFAULT true,
  session_id uuid DEFAULT gen_random_uuid(),
  email text,
  name text,
  company text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assessment_answers table
CREATE TABLE IF NOT EXISTS assessment_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  answer jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  preview_report jsonb,
  full_report jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_answers_updated_at
  BEFORE UPDATE ON assessment_answers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Users Policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (
    auth.uid() = id
    OR is_anonymous = true
  );

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow anonymous user creation"
  ON users
  FOR INSERT
  WITH CHECK (is_anonymous = true);

-- Assessment Answers Policies
CREATE POLICY "Users can read own answers"
  ON assessment_answers
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR user_id IN (
      SELECT id FROM users
      WHERE session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert own answers"
  ON assessment_answers
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR user_id IN (
      SELECT id FROM users
      WHERE session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update own answers"
  ON assessment_answers
  FOR UPDATE
  USING (
    user_id = auth.uid()
    OR user_id IN (
      SELECT id FROM users
      WHERE session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
      )
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    OR user_id IN (
      SELECT id FROM users
      WHERE session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Reports Policies
CREATE POLICY "Users can read own reports"
  ON reports
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR user_id IN (
      SELECT id FROM users
      WHERE session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert own reports"
  ON reports
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR user_id IN (
      SELECT id FROM users
      WHERE session_id = (
        SELECT session_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_session_id ON users(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_answers_user_id ON assessment_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
