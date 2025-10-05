import { supabase } from './supabase';
import { Player, CreatePlayerData, UpdatePlayerData } from '@/types/player';

export class PlayerService {
  // Get all players
  static async getPlayers(): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching players: ${error.message}`);
    }

    return data || [];
  }

  // Get a single player by ID
  static async getPlayer(id: string): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Player not found
      }
      throw new Error(`Error fetching player: ${error.message}`);
    }

    return data;
  }

  // Create a new player
  static async createPlayer(playerData: CreatePlayerData): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .insert([playerData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating player: ${error.message}`);
    }

    return data;
  }

  // Update an existing player
  static async updatePlayer(id: string, playerData: UpdatePlayerData): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .update(playerData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating player: ${error.message}`);
    }

    return data;
  }

  // Delete a player
  static async deletePlayer(id: string): Promise<void> {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting player: ${error.message}`);
    }
  }
}
