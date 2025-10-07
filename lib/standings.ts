import { supabase } from './supabase';
import { Standing, CreateStandingData } from '@/types/standing';

export class StandingService {
  // Get all standings
  static async getStandings(): Promise<Standing[]> {
    const { data, error } = await supabase
      .from('standings')
      .select(`
        *,
        group:groups(id, name),
        team:teams(
          id,
          player1_id,
          player2_id,
          player1:players!teams_player1_id_fkey(id, name),
          player2:players!teams_player2_id_fkey(id, name)
        )
      `)
      .order('group_id', { ascending: true });

    if (error) {
      throw new Error(`Error fetching standings: ${error.message}`);
    }

    return data || [];
  }

  // Get standings by group
  static async getStandingsByGroup(groupId: number): Promise<Standing[]> {
    const { data, error } = await supabase
      .from('standings')
      .select(`
        *,
        group:groups(id, name),
        team:teams(
          id,
          player1_id,
          player2_id,
          player1:players!teams_player1_id_fkey(id, name),
          player2:players!teams_player2_id_fkey(id, name)
        )
      `)
      .eq('group_id', groupId)
      .order('matches_won', { ascending: false });

    if (error) {
      throw new Error(`Error fetching standings for group: ${error.message}`);
    }

    return data || [];
  }

  // Create a single standing
  static async createStanding(standingData: CreateStandingData): Promise<Standing> {
    const { data, error } = await supabase
      .from('standings')
      .insert([standingData])
      .select(`
        *,
        group:groups(id, name),
        team:teams(
          id,
          player1_id,
          player2_id,
          player1:players!teams_player1_id_fkey(id, name),
          player2:players!teams_player2_id_fkey(id, name)
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error creating standing: ${error.message}`);
    }

    return data;
  }

  // Initialize tournament standings - creates a standing for each team in each group
  static async initializeTournamentStandings(): Promise<{ created: number; skipped: number }> {
    // Get all group-team assignments
    const { data: groupTeams, error: groupTeamsError } = await supabase
      .from('group_teams')
      .select('group_id, team_id');

    if (groupTeamsError) {
      throw new Error(`Error fetching group teams: ${groupTeamsError.message}`);
    }

    if (!groupTeams || groupTeams.length === 0) {
      throw new Error('No teams assigned to groups. Please assign teams before starting the tournament.');
    }

    // Check if standings already exist
    const { data: existingStandings, error: existingError } = await supabase
      .from('standings')
      .select('id');

    if (existingError) {
      throw new Error(`Error checking existing standings: ${existingError.message}`);
    }

    if (existingStandings && existingStandings.length > 0) {
      throw new Error('Tournament standings already initialized. Clear existing standings first.');
    }

    // Create standings for each team in each group
    const standingsToCreate = groupTeams.map(gt => ({
      group_id: gt.group_id,
      team_id: gt.team_id,
      matches_played: 0,
      matches_won: 0,
      matches_lost: 0,
      games_won: 0,
      games_lost: 0
    }));

    const { data, error } = await supabase
      .from('standings')
      .insert(standingsToCreate)
      .select('id');

    if (error) {
      throw new Error(`Error creating standings: ${error.message}`);
    }

    return {
      created: data?.length || 0,
      skipped: 0
    };
  }

  // Update a standing
  static async updateStanding(id: number, updates: Partial<CreateStandingData>): Promise<Standing> {
    const { data, error } = await supabase
      .from('standings')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        group:groups(id, name),
        team:teams(
          id,
          player1_id,
          player2_id,
          player1:players!teams_player1_id_fkey(id, name),
          player2:players!teams_player2_id_fkey(id, name)
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error updating standing: ${error.message}`);
    }

    return data;
  }

  // Delete a standing
  static async deleteStanding(id: number): Promise<void> {
    const { error } = await supabase
      .from('standings')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting standing: ${error.message}`);
    }
  }

  // Clear all standings
  static async clearAllStandings(): Promise<void> {
    const { error } = await supabase
      .from('standings')
      .delete()
      .gte('id', 0); // Delete all rows

    if (error) {
      throw new Error(`Error clearing standings: ${error.message}`);
    }
  }

  // Check if tournament is already initialized
  static async isTournamentInitialized(): Promise<boolean> {
    const { data, error } = await supabase
      .from('standings')
      .select('id')
      .limit(1);

    if (error) {
      throw new Error(`Error checking tournament status: ${error.message}`);
    }

    return (data?.length || 0) > 0;
  }
}
