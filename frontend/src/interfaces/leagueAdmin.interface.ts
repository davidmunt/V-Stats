export type LeagueAdminStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface LeagueAdmin {
  id_admin: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  dark_mode: boolean;
  refresh_token: string;
  created_at: Date;
  status: LeagueAdminStatus;
  is_active: boolean;
}
