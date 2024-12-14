export interface PrizeCard {
  id: string;
  prize_id: string;
  card_name: string;
  card_image_url: string;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
}