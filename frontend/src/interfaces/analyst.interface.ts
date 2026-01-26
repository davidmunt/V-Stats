export type AnalystStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Analyst {
  id_analyst: string;
  slug: string;
  id_team: string;
  name: string;
  email: string;
  avatar: string;
  status: AnalystStatus;
  is_active: boolean;
}
