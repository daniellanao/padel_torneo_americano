export interface Team {
  id: number;
  player1_id: number;
  player2_id: number;
  created_at: string;
  // Joined player data for display
  player1?: {
    id: number;
    name: string;
  };
  player2?: {
    id: number;
    name: string;
  };
}

export interface CreateTeamData {
  player1_id: number;
  player2_id: number;
}

export interface UpdateTeamData {
  player1_id: number;
  player2_id: number;
}
