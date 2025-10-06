-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id BIGSERIAL PRIMARY KEY,
  player1_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  player2_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_player1_id ON teams(player1_id);
CREATE INDEX IF NOT EXISTS idx_teams_player2_id ON teams(player2_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON teams
  FOR ALL USING (auth.role() = 'authenticated');

-- Alternative: Allow all operations for everyone (for development)
-- Uncomment the line below if you want to allow public access
-- CREATE POLICY "Allow all operations for everyone" ON teams FOR ALL USING (true);
