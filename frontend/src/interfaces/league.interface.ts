export type LeagueStatus = "ACTIVE" | "INACTIVE" | "COMPLETED" | "PENDING";

export interface League {
  id_league: number;
  id_category_league: string;
  id_admin: number;
  name: string;
  country: string;
  season: string;
  created_at: Date;
  status: LeagueStatus;
  image: string;
  is_active: boolean;
}
