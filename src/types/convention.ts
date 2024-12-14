export interface Convention {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string;
  venue: string;
  expected_attendees: number | null;
  image_url: string;
  website_url: string | null;
  registration_url: string | null;
  status: string | null;
  created_at: string;
  updated_at: string | null;
  is_featured: boolean | null;
  carousel_image: string | null;
}