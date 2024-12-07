-- Drop all existing RLS policies
DROP POLICY IF EXISTS ON profiles;
DROP POLICY IF EXISTS ON teams;
DROP POLICY IF EXISTS ON people;
DROP POLICY IF EXISTS ON outcomes;
DROP POLICY IF EXISTS ON tasks;
DROP POLICY IF EXISTS ON comments;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies (viewable by everyone, updatable by owner)
CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Teams policies (viewable by team members)
CREATE POLICY "Teams are viewable by team members" 
ON teams FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM people 
        WHERE people.team_id = teams.id 
        AND people.user_id = auth.uid()
    )
);

-- People policies (viewable by authenticated users)
CREATE POLICY "People records are viewable by authenticated users" 
ON people FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can manage their own people record" 
ON people FOR ALL 
TO authenticated 
USING (user_id = auth.uid());

-- Outcomes policies (viewable by team members)
CREATE POLICY "Outcomes are viewable by team members" 
ON outcomes FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM people 
        WHERE people.team_id = outcomes.team_id 
        AND people.user_id = auth.uid()
    )
);

CREATE POLICY "Team members can manage outcomes" 
ON outcomes FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM people 
        WHERE people.team_id = outcomes.team_id 
        AND people.user_id = auth.uid()
    )
);

-- Tasks policies (viewable by team members)
CREATE POLICY "Tasks are viewable by team members" 
ON tasks FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM outcomes 
        JOIN people ON outcomes.team_id = people.team_id 
        WHERE tasks.outcome_id = outcomes.id 
        AND people.user_id = auth.uid()
    )
);

CREATE POLICY "Team members can manage tasks" 
ON tasks FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM outcomes 
        JOIN people ON outcomes.team_id = people.team_id 
        WHERE tasks.outcome_id = outcomes.id 
        AND people.user_id = auth.uid()
    )
);

-- Comments policies (viewable by team members)
CREATE POLICY "Comments are viewable by team members" 
ON comments FOR SELECT 
TO authenticated 
USING (
    auth.uid() = user_id OR 
    EXISTS (
        SELECT 1 FROM outcomes 
        JOIN people ON outcomes.team_id = people.team_id 
        WHERE outcomes.id::text = comments.entity_id::text 
        AND people.user_id = auth.uid()
    )
);

CREATE POLICY "Users can manage their own comments" 
ON comments FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;