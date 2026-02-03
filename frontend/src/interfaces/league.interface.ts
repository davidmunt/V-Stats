export type LeagueStatus = "ACTIVE" | "INACTIVE" | "COMPLETED" | "PENDING";

export interface League {
  id_league: string;
  slug: string;
  id_category_league: string;
  id_admin: string;
  name: string;
  country: string;
  season: string;
  created_at: Date;
  updated_at: Date;
  status: string;
  image: string;
  is_active: boolean;
}
