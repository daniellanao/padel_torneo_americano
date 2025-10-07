import { supabase } from './supabase';
import { Match, CreateMatchData, UpdateMatchScoreData } from '@/types/match';
import { StandingService } from './standings';

export class MatchService {
  // Get all matches
  static async getMatches(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        group:groups(id, name),
        team1:teams!matches_team1_id_fkey(
          id,
          player1_id,
          player2_id,
          player1:players!teams_player1_id_fkey(id, name),
          player2:players!teams_player2_id_fkey(id, name)
        ),
        team2:teams!matches_team2_id_fkey(
          id,
          player1_id,
          player2_id,
          player1:players!teams_player1_id_fkey(id, name),
          player2:players!teams_player2_id_fkey(id, name)
        )
      `)
      .order('group_id', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Error fetching matches: ${error.message}`);
    }

    return data || [];
  }

  // Get matches by group
  static async getMatchesByGroup(groupId: number): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        group:groups(id, name),
        team1:teams!matches_team1_id_fkey(
          id,
          player1_id,
          player2_id,
          player1:players!teams_player1_id_fkey(id, name),
          player2:players!teams_player2_id_fkey(id, name)
        ),
        team2:teams!matches_team2_id_fkey(
          id,
          player1_id,
          player2_id,
          player1:players!teams_player1_id_fkey(id, name),
          player2:players!teams_player2_id_fkey(id, name)
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Error fetching matches for group: ${error.message}`);
    }

    return data || [];
  }

  // Create a single match
  static async createMatch(matchData: CreateMatchData): Promise<Match> {
    const { data, error } = await supabase
      .from('matches')
      .insert([{ ...matchData, status: matchData.status || 'pending' }])
      .select(`
        *,
        group:groups(id, name),
        team1:teams!matches_team1_id_fkey(
          id,
          player1_id,
          player2_id,
          player1:players!teams_player1_id_fkey(id, name),
          player2:players!teams_player2_id_fkey(id, name)
        ),
        team2:teams!matches_team2_id_fkey(
          id,
          player1_id,
          player2_id,
          player1:players!teams_player1_id_fkey(id, name),
          player2:players!teams_player2_id_fkey(id, name)
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error creating match: ${error.message}`);
    }

    return data;
  }

  // Generate round-robin matches for all groups
  static async generateRoundRobinMatches(): Promise<{ created: number }> {
    // Get all group-team assignments
    const { data: groupTeams, error: groupTeamsError } = await supabase
      .from('group_teams')
      .select('group_id, team_id')
      .order('group_id', { ascending: true });

    if (groupTeamsError) {
      throw new Error(`Error fetching group teams: ${groupTeamsError.message}`);
    }

    if (!groupTeams || groupTeams.length === 0) {
      throw new Error('No teams assigned to groups');
    }

    // Group teams by group_id
    const teamsByGroup = new Map<number, number[]>();
    groupTeams.forEach(gt => {
      if (!teamsByGroup.has(gt.group_id)) {
        teamsByGroup.set(gt.group_id, []);
      }
      teamsByGroup.get(gt.group_id)!.push(gt.team_id);
    });

    // Generate round-robin matches for each group
    const matchesToCreate: CreateMatchData[] = [];
    
    teamsByGroup.forEach((teamIds, groupId) => {
      // Create all possible pairings (round-robin)
      for (let i = 0; i < teamIds.length; i++) {
        for (let j = i + 1; j < teamIds.length; j++) {
          matchesToCreate.push({
            group_id: groupId,
            team1_id: teamIds[i],
            team2_id: teamIds[j],
            status: 'pending'
          });
        }
      }
    });

    if (matchesToCreate.length === 0) {
      throw new Error('No matches to create');
    }

    // Insert all matches
    const { data, error } = await supabase
      .from('matches')
      .insert(matchesToCreate)
      .select('id');

    if (error) {
      throw new Error(`Error creating matches: ${error.message}`);
    }

    return { created: data?.length || 0 };
  }

  // Update match score and standings
  static async updateMatchScore(matchId: number, scoreData: UpdateMatchScoreData): Promise<Match> {
    // Get the match details first
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('group_id, team1_id, team2_id, team1_score, team2_score, status')
      .eq('id', matchId)
      .single();

    if (matchError) {
      throw new Error(`Error fetching match: ${matchError.message}`);
    }

    // Check if match is already completed
    if (match.status === 'completed') {
      throw new Error('Match is already completed');
    }

    // Update the match
    const { data: updatedMatch, error: updateError } = await supabase
      .from('matches')
      .update(scoreData)
      .eq('id', matchId)
      .select(`
        *,
        group:groups(id, name),
        team1:teams!matches_team1_id_fkey(
          id,
          player1_id,
          player2_id,
          player1:players!teams_player1_id_fkey(id, name),
          player2:players!teams_player2_id_fkey(id, name)
        ),
        team2:teams!matches_team2_id_fkey(
          id,
          player1_id,
          player2_id,
          player1:players!teams_player1_id_fkey(id, name),
          player2:players!teams_player2_id_fkey(id, name)
        )
      `)
      .single();

    if (updateError) {
      throw new Error(`Error updating match: ${updateError.message}`);
    }

    // Update standings for both teams
    await this.updateStandingsAfterMatch(
      match.group_id,
      match.team1_id,
      match.team2_id,
      scoreData.team1_score,
      scoreData.team2_score
    );

    return updatedMatch;
  }

  // Update standings after a match is completed
  private static async updateStandingsAfterMatch(
    groupId: number,
    team1Id: number,
    team2Id: number,
    team1Score: number,
    team2Score: number
  ): Promise<void> {
    // Get current standings for both teams
    const { data: standings, error: standingsError } = await supabase
      .from('standings')
      .select('*')
      .eq('group_id', groupId)
      .in('team_id', [team1Id, team2Id]);

    if (standingsError) {
      throw new Error(`Error fetching standings: ${standingsError.message}`);
    }

    if (!standings || standings.length !== 2) {
      throw new Error('Standings not found for one or both teams');
    }

    const team1Standing = standings.find(s => s.team_id === team1Id)!;
    const team2Standing = standings.find(s => s.team_id === team2Id)!;

    // Determine winner
    const team1Won = team1Score > team2Score;

    // Update team1 standings
    const { error: update1Error } = await supabase
      .from('standings')
      .update({
        matches_played: team1Standing.matches_played + 1,
        matches_won: team1Standing.matches_won + (team1Won ? 1 : 0),
        matches_lost: team1Standing.matches_lost + (team1Won ? 0 : 1),
        games_won: team1Standing.games_won + team1Score,
        games_lost: team1Standing.games_lost + team2Score
      })
      .eq('id', team1Standing.id);

    if (update1Error) {
      throw new Error(`Error updating team1 standings: ${update1Error.message}`);
    }

    // Update team2 standings
    const { error: update2Error } = await supabase
      .from('standings')
      .update({
        matches_played: team2Standing.matches_played + 1,
        matches_won: team2Standing.matches_won + (team1Won ? 0 : 1),
        matches_lost: team2Standing.matches_lost + (team1Won ? 1 : 0),
        games_won: team2Standing.games_won + team2Score,
        games_lost: team2Standing.games_lost + team1Score
      })
      .eq('id', team2Standing.id);

    if (update2Error) {
      throw new Error(`Error updating team2 standings: ${update2Error.message}`);
    }
  }
}
