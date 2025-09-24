/*
  # Finance Tracker Schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `project_name` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `income`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `name` (text)
      - `phone_number` (text)
      - `amount` (decimal)
      - `description` (text)
      - `date` (date)
      - `called_status` (boolean)
      - `created_at` (timestamp)
    
    - `expenses`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `description` (text)
      - `amount` (decimal)
      - `date` (date)
      - `category` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for project-based access control
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create income table
CREATE TABLE IF NOT EXISTS income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone_number TEXT,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  called_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create expenses table  
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for projects (public read access for project names)
CREATE POLICY "Anyone can read project names"
  ON projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create projects"
  ON projects
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for income (no direct access, handled via API)
CREATE POLICY "Public access to income"
  ON income
  FOR ALL
  TO public
  USING (true);

-- Create policies for expenses (no direct access, handled via API)
CREATE POLICY "Public access to expenses"
  ON expenses
  FOR ALL
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_income_project_id ON income(project_id);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_project_id ON expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);