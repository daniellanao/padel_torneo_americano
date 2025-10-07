import { supabase } from './supabase';
import { GroupTeam, CreateGroupTeamData, GroupWithTeams, TeamAssignment } from '@/types/groupTeam';
import { Team } from '@/types/team';

export class GroupTeamService {
  // Get all group-team assignments
  static async getGroupTeams(): Promise<GroupTeam[]> {
    const { data, error } = await supabase
      .from('group_teams')
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
      throw new Error(`Error fetching group teams: ${error.message}`);
    }

    return data || [];
  }

  // Get teams assigned to a specific group
  static async getTeamsByGroup(groupId: number): Promise<GroupTeam[]> {
    const { data, error } = await supabase
      .from('group_teams')
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
      .order('team_id', { ascending: true });

    if (error) {
      throw new Error(`Error fetching teams for group: ${error.message}`);
    }

    return data || [];
  }

  // Get all groups with their team assignments
  static async getGroupsWithTeams(): Promise<GroupWithTeams[]> {
    // Get all groups
    const { data: groups, error: groupsError } = await supabase
      .from('groups')
      .select('id, name')
      .order('name', { ascending: true });

    if (groupsError) {
      throw new Error(`Error fetching groups: ${groupsError.message}`);
    }

    // Get all teams
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select(`
        id,
        player1_id,
        player2_id,
        player1:players!teams_player1_id_fkey(id, name),
        player2:players!teams_player2_id_fkey(id, name)
      `)
      .order('id', { ascending: true });

    if (teamsError) {
      throw new Error(`Error fetching teams: ${teamsError.message}`);
    }

    // Get all assignments
    const { data: assignments, error: assignmentsError } = await supabase
      .from('group_teams')
      .select('group_id, team_id');

    if (assignmentsError) {
      throw new Error(`Error fetching assignments: ${assignmentsError.message}`);
    }

    // Create assignment maps for quick lookup
    const assignmentMap = new Map<string, boolean>(); // group-team assignments
    const teamToGroupMap = new Map<number, number>(); // team to group mapping
    
    assignments?.forEach(assignment => {
      const key = `${assignment.group_id}-${assignment.team_id}`;
      assignmentMap.set(key, true);
      teamToGroupMap.set(assignment.team_id, assignment.group_id);
    });

    // Build the result - each group only shows teams that are either:
    // 1. Assigned to that specific group, OR
    // 2. Not assigned to any group at all
    const result: GroupWithTeams[] = groups?.map(group => {
      const groupTeams = teams?.filter(team => {
        const isAssignedToThisGroup = assignmentMap.has(`${group.id}-${team.id}`);
        const isAssignedToOtherGroup = teamToGroupMap.has(team.id) && teamToGroupMap.get(team.id) !== group.id;
        const isUnassigned = !teamToGroupMap.has(team.id);
        
        // Show team if it's assigned to this group OR if it's completely unassigned
        return isAssignedToThisGroup || isUnassigned;
      }).map(team => ({
        team: {
          id: team.id,
          player1: team.player1 && typeof team.player1 === 'object' && 'name' in team.player1 ? { name: String(team.player1.name) } : undefined,
          player2: team.player2 && typeof team.player2 === 'object' && 'name' in team.player2 ? { name: String(team.player2.name) } : undefined,
        },
        assigned: assignmentMap.has(`${group.id}-${team.id}`) || false
      })) || [];

      return {
        group,
        teams: groupTeams
      };
    }) || [];

    return result;
  }

  // Assign a team to a group
  static async assignTeamToGroup(groupId: number, teamId: number): Promise<GroupTeam> {
    const { data, error } = await supabase
      .from('group_teams')
      .insert([{ group_id: groupId, team_id: teamId }])
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
      throw new Error(`Error assigning team to group: ${error.message}`);
    }

    return data;
  }

  // Remove a team from a group
  static async removeTeamFromGroup(groupId: number, teamId: number): Promise<void> {
    const { error } = await supabase
      .from('group_teams')
      .delete()
      .eq('group_id', groupId)
      .eq('team_id', teamId);

    if (error) {
      throw new Error(`Error removing team from group: ${error.message}`);
    }
  }

  // Toggle team assignment (assign if not assigned, remove if assigned)
  static async toggleTeamAssignment(groupId: number, teamId: number): Promise<boolean> {
    // Check if assignment exists
    const { data: existing, error: checkError } = await supabase
      .from('group_teams')
      .select('id')
      .eq('group_id', groupId)
      .eq('team_id', teamId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Error checking assignment: ${checkError.message}`);
    }

    if (existing) {
      // Assignment exists, remove it
      await this.removeTeamFromGroup(groupId, teamId);
      return false; // Now unassigned
    } else {
      // Assignment doesn't exist, create it
      await this.assignTeamToGroup(groupId, teamId);
      return true; // Now assigned
    }
  }

  // Get unassigned teams
  static async getUnassignedTeams(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        id,
        player1_id,
        player2_id,
        player1:players!teams_player1_id_fkey(id, name),
        player2:players!teams_player2_id_fkey(id, name)
      `)
      .not('id', 'in', `(SELECT team_id FROM group_teams)`)
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`Error fetching unassigned teams: ${error.message}`);
    }

    return data || [];
  }
}
