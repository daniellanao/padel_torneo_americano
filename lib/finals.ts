import { supabase } from './supabase';
import { Final, CreateFinalData, UpdateFinalData } from '../types/final';

export async function getFinals(): Promise<Final[]> {
  const { data, error } = await supabase
    .from('finals')
    .select(`
      *,
      team1:team1_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      ),
      team2:team2_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      ),
      team_winner:team_winner_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      )
    `)
    .order('type', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching finals:', error);
    throw error;
  }

  return data || [];
}

export async function getFinalsByType(type: 'quarter' | 'semis' | 'final'): Promise<Final[]> {
  const { data, error } = await supabase
    .from('finals')
    .select(`
      *,
      team1:team1_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      ),
      team2:team2_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      ),
      team_winner:team_winner_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      )
    `)
    .eq('type', type)
    .order('created_at', { ascending: true });

  if (error) {
    console.error(`Error fetching ${type} finals:`, error);
    throw error;
  }

  return data || [];
}

export async function createFinal(finalData: CreateFinalData): Promise<Final> {
  const { data, error } = await supabase
    .from('finals')
    .insert([finalData])
    .select(`
      *,
      team1:team1_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      ),
      team2:team2_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      )
    `)
    .single();

  if (error) {
    console.error('Error creating final:', error);
    throw error;
  }

  return data;
}

export async function updateFinal(id: number, finalData: UpdateFinalData): Promise<Final> {
  const { data, error } = await supabase
    .from('finals')
    .update(finalData)
    .eq('id', id)
    .select(`
      *,
      team1:team1_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      ),
      team2:team2_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      ),
      team_winner:team_winner_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      )
    `)
    .single();

  if (error) {
    console.error('Error updating final:', error);
    throw error;
  }

  return data;
}

export async function deleteFinal(id: number): Promise<void> {
  const { error } = await supabase
    .from('finals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting final:', error);
    throw error;
  }
}

export async function getFinalById(id: number): Promise<Final | null> {
  const { data, error } = await supabase
    .from('finals')
    .select(`
      *,
      team1:team1_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      ),
      team2:team2_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      ),
      team_winner:team_winner_id (
        id,
        player1_id,
        player2_id,
        player1:player1_id (
          id,
          name
        ),
        player2:player2_id (
          id,
          name
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching final:', error);
    throw error;
  }

  return data;
}
