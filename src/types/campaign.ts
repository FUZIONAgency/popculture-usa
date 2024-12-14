export interface CampaignInvitation {
  id: string;
  campaign_id: string | null;
  email: string | null;
  token: string | null;
  status: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface CampaignPlayer {
  id: string;
  campaign_id: string;
  player_id: string;
  role_type: string;
  status: string | null;
  joined_at: string | null;
}

export interface Campaign {
  id: string;
  game_system_id: string;
  title: string;
  description: string | null;
  type: string | null;
  min_players: number;
  max_players: number;
  status: string | null;
  price: number;
  created_at: string;
}