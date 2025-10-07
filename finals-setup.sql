-- Create finals table for tournament finals matches
CREATE TABLE IF NOT EXISTS public.finals (
  id bigserial primary key,
  team1_id bigint not null references public.teams(id) on delete cascade,
  team2_id bigint not null references public.teams(id) on delete cascade,
  team1_score int,
  team2_score int,
  -- Ganador (opcional) con FK; se pone NULL si borran el equipo
  team_winner_id bigint references public.teams(id) on delete set null,
  -- Tipo de fase
  type text not null check (type in ('quarter','semis','final')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_finals_team1_id ON public.finals(team1_id);
CREATE INDEX IF NOT EXISTS idx_finals_team2_id ON public.finals(team2_id);
CREATE INDEX IF NOT EXISTS idx_finals_winner_id ON public.finals(team_winner_id);
CREATE INDEX IF NOT EXISTS idx_finals_type ON public.finals(type);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_finals_updated_at 
    BEFORE UPDATE ON public.finals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.finals ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Enable read access for all users" ON public.finals
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.finals
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.finals
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.finals
    FOR DELETE USING (true);
