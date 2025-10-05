export interface Player {
  id: string;
  name: string;
  created_at: string;
}

export interface CreatePlayerData {
  name: string;
}

export interface UpdatePlayerData {
  name: string;
}
