-- Drop all existing tables and related objects
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS outcomes CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS people CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    timezone TEXT,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create people table (for team membership)
CREATE TABLE people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create outcomes table
CREATE TABLE outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    interval TEXT NOT NULL,
    next_due TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id),
    parent_outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES profiles(id),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    entity_id UUID NOT NULL,
    entity_type TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Teams policies
CREATE POLICY "Teams are viewable by team members" 
ON teams FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM people 
        WHERE people.team_id = teams.id 
        AND people.user_id = auth.uid()
    )
);

-- People policies
CREATE POLICY "People records are viewable by authenticated users" 
ON people FOR SELECT USING (true);

CREATE POLICY "Users can manage their own people record" 
ON people FOR ALL USING (user_id = auth.uid());

-- Outcomes policies
CREATE POLICY "Outcomes are viewable by team members" 
ON outcomes FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM people 
        WHERE people.team_id = outcomes.team_id 
        AND people.user_id = auth.uid()
    )
);

-- Tasks policies
CREATE POLICY "Tasks are viewable by team members" 
ON tasks FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM outcomes 
        JOIN people ON outcomes.team_id = people.team_id 
        WHERE tasks.outcome_id = outcomes.id 
        AND people.user_id = auth.uid()
    )
);

-- Comments policies
CREATE POLICY "Comments are viewable by team members" 
ON comments FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
        SELECT 1 FROM outcomes 
        JOIN people ON outcomes.team_id = people.team_id 
        WHERE outcomes.id::text = comments.entity_id::text 
        AND people.user_id = auth.uid()
    )
);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Create indexes for better performance
CREATE INDEX idx_people_team_user ON people(team_id, user_id);
CREATE INDEX idx_outcomes_team ON outcomes(team_id);
CREATE INDEX idx_tasks_outcome ON tasks(outcome_id);
CREATE INDEX idx_comments_entity ON comments(entity_id, entity_type);