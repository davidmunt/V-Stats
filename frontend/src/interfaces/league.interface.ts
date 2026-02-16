export type LeagueStatus = "ACTIVE" | "INACTIVE" | "COMPLETED" | "PENDING";

export interface League {
  slug_league: string;
  slug_category: string;
  slug_admin: string;
  name: string;
  country: string;
  season: string;
  created_at: Date;
  updated_at: Date;
  status: string;
  image: string;
  is_active: boolean;
}
