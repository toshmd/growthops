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

-- Simple, non-recursive policies for profiles
CREATE POLICY "Allow public read access to profiles"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow users to update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Simple, non-recursive policies for people
CREATE POLICY "Allow authenticated read access to people"
ON people FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow users to insert their own people record"
ON people FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own people record"
ON people FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own people record"
ON people FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT ON profiles TO anon, authenticated;
GRANT UPDATE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON people TO authenticated;