export type UserRole = "admin" | "coach" | "analyst" | "player" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  dark_mode: boolean;
  user_type: UserRole;
  accessToken: string;
  id_team: string;
  slug: string;
}
