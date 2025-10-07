-- Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id BIGSERIAL NOT NULL,
  group_id BIGINT NOT NULL,
  team1_id BIGINT NOT NULL,
  team2_id BIGINT NOT NULL,
  team1_score INTEGER NULL,
  team2_score INTEGER NULL,
  status TEXT NOT NULL DEFAULT 'pending'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  team_winner_id INTEGER NULL,
  CONSTRAINT matches_pkey PRIMARY KEY (id),
  CONSTRAINT matches_team1_id_fkey FOREIGN KEY (team1_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT matches_team2_id_fkey FOREIGN KEY (team2_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT matches_team_winner_id_fkey FOREIGN KEY (team_winner_id) REFERENCES teams(id),
  CONSTRAINT matches_group_id_fkey FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  CONSTRAINT matches_status_check CHECK (
    status = ANY (ARRAY['pending'::TEXT, 'in_progress'::TEXT, 'completed'::TEXT])
  ),
  CONSTRAINT matches_check1 CHECK (
    (team1_score IS NULL AND team2_score IS NULL) OR
    (team1_score >= 0 AND team2_score >= 0)
  ),
  CONSTRAINT matches_check CHECK (team1_id <> team2_id)
) TABLESPACE pg_default;

-- Create function to set updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trg_matches_updated
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_matches_group_id ON matches(group_id);
CREATE INDEX IF NOT EXISTS idx_matches_team1_id ON matches(team1_id);
CREATE INDEX IF NOT EXISTS idx_matches_team2_id ON matches(team2_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON matches
  FOR ALL USING (auth.role() = 'authenticated');

-- Alternative: Allow all operations for everyone (for development)
-- Uncomment the line below if you want to allow public access
-- CREATE POLICY "Allow all operations for everyone" ON matches FOR ALL USING (true);
