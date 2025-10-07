export interface Match {
  id: number;
  group_id: number;
  team1_id: number;
  team2_id: number;
  team1_score: number | null;
  team2_score: number | null;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
  team_winner_id: number | null;
  // Joined data for display
  group?: {
    id: number;
    name: string;
  };
  team1?: {
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
  team2?: {
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

export interface CreateMatchData {
  group_id: number;
  team1_id: number;
  team2_id: number;
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface UpdateMatchScoreData {
  team1_score: number;
  team2_score: number;
  status: 'completed';
  team_winner_id: number;
}
