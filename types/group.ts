export interface Group {
  id: number;
  name: string;
  created_at: string;
}

export interface CreateGroupData {
  name: string;
}

export interface UpdateGroupData {
  name: string;
}
