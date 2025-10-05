# Padel Tournament - Players CRUD Setup

## Supabase Configuration

### 1. Environment Variables
Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup
Run the following SQL in your Supabase SQL editor to create the players table:

```sql
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
CREATE POLICY "Allow all operations for authenticated users" ON players
  FOR ALL USING (auth.role() = 'authenticated');
```

### 3. Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project dashboard, go to Settings > API
3. Copy the Project URL and anon public key
4. Add them to your `.env.local` file

### 4. Running the Application

```bash
npm run dev
```

Navigate to `/players` to access the Players CRUD interface.

## Features

- ✅ **Create** new players
- ✅ **Read** all players with pagination
- ✅ **Update** existing players
- ✅ **Delete** players with confirmation
- ✅ **Responsive design** for mobile and desktop
- ✅ **Dark mode support**
- ✅ **Loading states** and error handling
- ✅ **Form validation**

## File Structure

```
├── app/
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation component
│   │   ├── PlayerForm.tsx      # Player form component
│   │   └── PlayerList.tsx      # Player list component
│   ├── players/
│   │   └── page.tsx            # Players page
│   └── layout.tsx              # Root layout with navbar
├── lib/
│   ├── supabase.ts             # Supabase client configuration
│   └── players.ts              # Player service with CRUD operations
├── types/
│   └── player.ts               # TypeScript interfaces
└── supabase-setup.sql          # Database setup script
```
