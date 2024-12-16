export interface Player {
  id: string;
  alias: string;
  email?: string;
  city?: string;
  state?: string;
  status?: string;
  auth_id?: string;
  alias_image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PlayerRetailerConnection {
  id: string;
  retailer_id: string;
  player_id: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  email?: string;
  username?: string;
  avatar_url?: string;
  created_at?: string;
}