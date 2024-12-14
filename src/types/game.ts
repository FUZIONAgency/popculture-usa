export interface GameSystem {
  id: string;
  name: string | null;
  type: string | null;
  description: string | null;
  status: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface PlayerGameAccount {
  id: string;
  player_id: string;
  game_system_id: string;
  account_id: string;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}