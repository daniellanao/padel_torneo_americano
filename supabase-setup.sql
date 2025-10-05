-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for better performance
CREATE INDEX IF NOT EXISTS idx_players_created_at ON players(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- You can modify this based on your authentication requirements
CREATE POLICY "Allow all operations for authenticated users" ON players
  FOR ALL USING (auth.role() = 'authenticated');

-- Alternative: Allow all operations for everyone (for development)
-- Uncomment the line below if you want to allow public access
-- CREATE POLICY "Allow all operations for everyone" ON players FOR ALL USING (true);
