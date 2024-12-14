export interface Retailer {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}