export type CoachStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Coach {
  id_coach: string;
  id_team: string;
  name: string;
  email: string;
  avatar: string;
  password?: string;
  dark_mode: boolean;
  refresh_token: string;
  status: CoachStatus;
  is_active: boolean;
}
