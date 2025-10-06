export interface GroupTeam {
  id: number;
  group_id: number;
  team_id: number;
  created_at: string;
  // Joined data for display
  group?: {
    id: number;
    name: string;
  };
  team?: {
    id: number;
    player1_id: number;
    player2_id: number;
    player1?: {
      id: number;
      name: string;
    };
    player2?: {
      id: number;
      name: string;
    };
  };
}

export interface CreateGroupTeamData {
  group_id: number;
  team_id: number;
}

export interface TeamAssignment {
  team: {
    id: number;
    player1?: { name: string };
    player2?: { name: string };
  };
  assigned: boolean;
}

export interface GroupWithTeams {
  group: {
    id: number;
    name: string;
  };
  teams: TeamAssignment[];
}
