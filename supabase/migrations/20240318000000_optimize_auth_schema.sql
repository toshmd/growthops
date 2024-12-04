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

-- Ensure profiles table has all necessary columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add missing index for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- Ensure people table has correct structure
ALTER TABLE people 
ADD COLUMN IF NOT EXISTS is_advisor BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS role TEXT;

-- Add missing index for people
CREATE INDEX IF NOT EXISTS idx_people_user_id ON people(user_id);

-- Add updated_at trigger to profiles if it doesn't exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update or create is_user_advisor function
CREATE OR REPLACE FUNCTION is_user_advisor(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM people 
        WHERE user_id = $1 
        AND is_advisor = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS profiles_select ON profiles;
DROP POLICY IF EXISTS profiles_update ON profiles;
DROP POLICY IF EXISTS people_select ON people;
DROP POLICY IF EXISTS people_insert ON people;
DROP POLICY IF EXISTS people_update ON people;
DROP POLICY IF EXISTS people_delete ON people;

-- Create new RLS policies for profiles
CREATE POLICY profiles_select ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY profiles_update ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Create new RLS policies for people
CREATE POLICY people_select ON people FOR SELECT TO authenticated 
USING (
    user_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM people p
        WHERE p.user_id = auth.uid()
        AND p.is_advisor = true
    )
);

CREATE POLICY people_insert ON people FOR INSERT TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM people p
        WHERE p.user_id = auth.uid()
        AND p.is_advisor = true
    )
);

CREATE POLICY people_update ON people FOR UPDATE TO authenticated 
USING (
    user_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM people p
        WHERE p.user_id = auth.uid()
        AND p.is_advisor = true
    )
);

CREATE POLICY people_delete ON people FOR DELETE TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM people p
        WHERE p.user_id = auth.uid()
        AND p.is_advisor = true
    )
);

-- Update advisor access function
CREATE OR REPLACE FUNCTION give_user_access_to_all_companies(user_uuid UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO people (user_id, is_advisor, role)
    VALUES (user_uuid, true, 'advisor')
    ON CONFLICT (user_id) DO UPDATE
    SET is_advisor = true, role = 'advisor';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;