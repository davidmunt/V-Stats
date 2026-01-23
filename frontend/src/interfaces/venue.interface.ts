export type VenueStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export interface Venue {
  id_venue: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  indoor: boolean;
  created_at: Date;
  status: VenueStatus;
  is_active: boolean;
}
