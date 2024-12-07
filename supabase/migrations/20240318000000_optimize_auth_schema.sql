-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Simplify profiles table
ALTER TABLE profiles 
DROP COLUMN IF EXISTS company_id,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add missing index for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- Simplify people table to only track team membership
ALTER TABLE people 
DROP COLUMN IF EXISTS is_advisor,
DROP COLUMN IF EXISTS company_id,
ADD COLUMN IF NOT EXISTS role TEXT;

-- Add missing index for people
CREATE INDEX IF NOT EXISTS idx_people_user_id ON people(user_id);
CREATE INDEX IF NOT EXISTS idx_people_team_id ON people(team_id);

-- Add updated_at trigger to profiles if it doesn't exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Drop existing policies
DROP POLICY IF EXISTS profiles_select ON profiles;
DROP POLICY IF EXISTS profiles_update ON profiles;
DROP POLICY IF EXISTS people_select ON people;
DROP POLICY IF EXISTS people_insert ON people;
DROP POLICY IF EXISTS people_update ON people;
DROP POLICY IF EXISTS people_delete ON people;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for profiles without recursion
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Create basic RLS policies for people without recursion
CREATE POLICY "People records are viewable by everyone"
ON people FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own people record"
ON people FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own people record"
ON people FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own people record"
ON people FOR DELETE
USING (auth.uid() = user_id);