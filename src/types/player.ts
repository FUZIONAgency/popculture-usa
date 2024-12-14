export interface Player {
  id: string;
  alias: string;
  email: string | null;
  city: string | null;
  state: string | null;
  status: string | null;
  auth_id: string | null;
  alias_image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Profile {
  id: string;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
  created_at: string | null;
}