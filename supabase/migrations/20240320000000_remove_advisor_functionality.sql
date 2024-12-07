-- Remove advisor-related columns and functions
ALTER TABLE people DROP COLUMN IF EXISTS is_advisor;
DROP FUNCTION IF EXISTS is_user_advisor CASCADE;

-- Update RLS policies for people table to remove advisor checks
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