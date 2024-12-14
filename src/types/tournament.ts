export interface TournamentEntry {
  id: string;
  tournament_id: string;
  player_id: string;
  registration_date: string | null;
  status: string | null;
  final_rank: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TournamentPrize {
  id: string;
  tournament_id: string;
  placement: number;
  description: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Tournament {
  id: string;
  game_system_id: string | null;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string;
  venue: string;
  prize_pool: number | null;
  max_participants: number | null;
  current_participants: number | null;
  registration_deadline: string | null;
  image_url: string | null;
  is_featured: boolean | null;
  tournament_type: string | null;
  status: string | null;
  registration_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  carousel_image: string | null;
}