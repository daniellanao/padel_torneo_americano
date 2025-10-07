export interface Final {
  id: number;
  team1_id: number;
  team2_id: number;
  team1_score: number | null;
  team2_score: number | null;
  team_winner_id: number | null;
  type: 'quarter' | 'semis' | 'final';
  created_at: string;
  updated_at: string;
  // Joined team data for display
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
  team_winner?: {
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

export interface CreateFinalData {
  team1_id: number;
  team2_id: number;
  type: 'quarter' | 'semis' | 'final';
}

export interface UpdateFinalData {
  team1_id?: number;
  team2_id?: number;
  team1_score?: number | null;
  team2_score?: number | null;
  team_winner_id?: number | null;
  type?: 'quarter' | 'semis' | 'final';
}
