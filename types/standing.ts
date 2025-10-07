export interface Standing {
  id: number;
  group_id: number;
  team_id: number;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  games_won: number;
  games_lost: number;
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

export interface CreateStandingData {
  group_id: number;
  team_id: number;
  matches_played?: number;
  matches_won?: number;
  matches_lost?: number;
  games_won?: number;
  games_lost?: number;
}
