export type AnalystStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Analyst {
  id_analyst: string;
  id_team: string;
  name: string;
  email: string;
  avatar: string;
  password?: string;
  dark_mode: boolean;
  refresh_token: string;
  status: AnalystStatus;
  is_active: boolean;
}
