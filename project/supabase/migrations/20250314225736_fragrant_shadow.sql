/*
  # Initial Schema Setup for KidsLearn Platform

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `current_level` (text)
      - `total_score` (integer)
      - `created_at` (timestamp)
    
    - `quizzes`
      - `id` (uuid, primary key)
      - `level` (text)
      - `question` (text)
      - `options` (jsonb)
      - `correct_answer` (integer)
      - `difficulty` (text)
      
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `quiz_id` (uuid, references quizzes)
      - `score` (integer)
      - `completed_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  current_level text DEFAULT 'Beginner',
  total_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create quizzes table
CREATE TABLE quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  difficulty text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user progress table
CREATE TABLE user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  quiz_id uuid REFERENCES quizzes ON DELETE CASCADE,
  score integer NOT NULL,
  completed_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Everyone can read quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read their own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert initial quiz data
INSERT INTO quizzes (level, question, options, correct_answer, difficulty)
VALUES
  ('Beginner', 'What comes after the number 5?', '["4", "6", "7", "3"]', 1, 'easy'),
  ('Beginner', 'Which animal says ''meow''?', '["Dog", "Cat", "Bird", "Fish"]', 1, 'easy'),
  ('Explorer', 'What is 3 + 5?', '["7", "8", "9", "6"]', 1, 'medium'),
  ('Explorer', 'How many sides does a triangle have?', '["2", "3", "4", "5"]', 1, 'medium'),
  ('Master', 'What is 4 × 6?', '["22", "24", "26", "28"]', 1, 'hard');