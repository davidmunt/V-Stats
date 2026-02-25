export type AnalystStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Analyst {
  slug_analyst: string;
  slug_team: string;
  name: string;
  email: string;
  avatar: string;
  status: AnalystStatus;
  is_active: boolean;
}
