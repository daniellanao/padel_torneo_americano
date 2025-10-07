-- Create standings table
CREATE TABLE IF NOT EXISTS public.standings (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  team_id BIGINT NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  matches_played INT NOT NULL DEFAULT 0,
  matches_won INT NOT NULL DEFAULT 0,
  matches_lost INT NOT NULL DEFAULT 0,
  games_won INT NOT NULL DEFAULT 0,
  games_lost INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, team_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_standings_group_id ON standings(group_id);
CREATE INDEX IF NOT EXISTS idx_standings_team_id ON standings(team_id);
CREATE INDEX IF NOT EXISTS idx_standings_matches_won ON standings(matches_won DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON standings
  FOR ALL USING (auth.role() = 'authenticated');

-- Alternative: Allow all operations for everyone (for development)
-- Uncomment the line below if you want to allow public access
-- CREATE POLICY "Allow all operations for everyone" ON standings FOR ALL USING (true);
