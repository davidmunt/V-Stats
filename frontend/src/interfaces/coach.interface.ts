export type CoachStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Coach {
  slug_coach: string;
  slug_team: string;
  name: string;
  email: string;
  avatar: string;
  status: CoachStatus;
  is_active: boolean;
}
