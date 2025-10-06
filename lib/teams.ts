import { supabase } from './supabase';
import { Team, CreateTeamData, UpdateTeamData } from '@/types/team';

export class TeamService {
  // Get all teams with player information
  static async getTeams(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        player1:players!teams_player1_id_fkey(id, name),
        player2:players!teams_player2_id_fkey(id, name)
      `)
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`Error fetching teams: ${error.message}`);
    }

    return data || [];
  }

  // Get a single team by ID
  static async getTeam(id: number): Promise<Team | null> {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        player1:players!teams_player1_id_fkey(id, name),
        player2:players!teams_player2_id_fkey(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Team not found
      }
      throw new Error(`Error fetching team: ${error.message}`);
    }

    return data;
  }

  // Create a new team
  static async createTeam(teamData: CreateTeamData): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .insert([teamData])
      .select(`
        *,
        player1:players!teams_player1_id_fkey(id, name),
        player2:players!teams_player2_id_fkey(id, name)
      `)
      .single();

    if (error) {
      throw new Error(`Error creating team: ${error.message}`);
    }

    return data;
  }

  // Update an existing team
  static async updateTeam(id: number, teamData: UpdateTeamData): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .update(teamData)
      .eq('id', id)
      .select(`
        *,
        player1:players!teams_player1_id_fkey(id, name),
        player2:players!teams_player2_id_fkey(id, name)
      `)
      .single();

    if (error) {
      throw new Error(`Error updating team: ${error.message}`);
    }

    return data;
  }

  // Delete a team
  static async deleteTeam(id: number): Promise<void> {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting team: ${error.message}`);
    }
  }

  // Get all players for team selection
  static async getPlayers(): Promise<{ id: number; name: string }[]> {
    const { data, error } = await supabase
      .from('players')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Error fetching players: ${error.message}`);
    }

    return data || [];
  }
}
