export interface Retailer {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string | null;
  email: string | null;
  website_url: string | null;
  lat: number;
  lng: number;
  hours_of_operation: Json | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  store_photo: string | null;
  is_featured: boolean | null;
  carousel_image: string | null;
}

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]