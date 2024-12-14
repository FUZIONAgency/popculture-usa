export interface Session {
  id: string;
  campaign_id: string;
  session_number: number;
  session_date: string;
  description: string | null;
  status: string | null;
  created_at: string | null;
  price: number;
}