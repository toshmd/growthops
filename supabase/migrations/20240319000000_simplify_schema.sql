-- Drop unnecessary tables
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- Remove advisor-related columns from people table
ALTER TABLE people 
DROP COLUMN IF EXISTS is_advisor,
DROP COLUMN IF EXISTS company_id;

-- Remove company-related columns from profiles
ALTER TABLE profiles 
DROP COLUMN IF EXISTS company_id;

-- Remove company-related columns from teams
ALTER TABLE teams 
DROP COLUMN IF EXISTS company_id;

-- Remove company-related columns from outcomes
ALTER TABLE outcomes 
DROP COLUMN IF EXISTS company_id;

-- Drop advisor-related functions
DROP FUNCTION IF EXISTS is_user_advisor CASCADE;
DROP FUNCTION IF EXISTS give_user_access_to_all_companies CASCADE;

-- Update RLS policies for people table
DROP POLICY IF EXISTS people_select ON people;
DROP POLICY IF EXISTS people_insert ON people;
DROP POLICY IF EXISTS people_update ON people;
DROP POLICY IF EXISTS people_delete ON people;

CREATE POLICY people_select ON people 
    FOR SELECT TO authenticated 
    USING (true);

CREATE POLICY people_insert ON people 
    FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY people_update ON people 
    FOR UPDATE TO authenticated 
    USING (auth.uid() = user_id);

CREATE POLICY people_delete ON people 
    FOR DELETE TO authenticated 
    USING (auth.uid() = user_id);

-- Clean up any orphaned records
DELETE FROM outcomes WHERE team_id IS NULL;
DELETE FROM people WHERE team_id IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_people_team_user ON people(team_id, user_id);
CREATE INDEX IF NOT EXISTS idx_outcomes_team ON outcomes(team_id);