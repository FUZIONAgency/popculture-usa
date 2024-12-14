export interface Notification {
  id: string;
  recipient: string;
  type: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}