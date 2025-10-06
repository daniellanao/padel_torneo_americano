import { supabase } from './supabase';
import { Group, CreateGroupData, UpdateGroupData } from '@/types/group';

export class GroupService {
  // Get all groups
  static async getGroups(): Promise<Group[]> {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Error fetching groups: ${error.message}`);
    }

    return data || [];
  }

  // Get a single group by ID
  static async getGroup(id: number): Promise<Group | null> {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Group not found
      }
      throw new Error(`Error fetching group: ${error.message}`);
    }

    return data;
  }

  // Create a new group
  static async createGroup(groupData: CreateGroupData): Promise<Group> {
    const { data, error } = await supabase
      .from('groups')
      .insert([groupData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating group: ${error.message}`);
    }

    return data;
  }

  // Update an existing group
  static async updateGroup(id: number, groupData: UpdateGroupData): Promise<Group> {
    const { data, error } = await supabase
      .from('groups')
      .update(groupData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating group: ${error.message}`);
    }

    return data;
  }

  // Delete a group
  static async deleteGroup(id: number): Promise<void> {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting group: ${error.message}`);
    }
  }
}
