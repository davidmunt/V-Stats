export type CoachStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Coach {
  id_coach: string;
  slug: string;
  id_team: string;
  name: string;
  email: string;
  avatar: string;
  status: CoachStatus;
  is_active: boolean;
}
