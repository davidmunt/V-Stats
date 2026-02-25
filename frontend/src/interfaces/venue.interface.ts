export type VenueStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export interface Venue {
  slug_venue: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  indoor: boolean;
  created_at: Date;
  status: string;
  is_active: boolean;
}
