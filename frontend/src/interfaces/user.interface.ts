export type UserRole = "admin" | "coach" | "analyst" | "player" | "user";

export interface User {
  slug_user: string;
  name: string;
  email: string;
  avatar?: string;
  user_type: UserRole;
  is_vip?: boolean;
  accessToken: string;
  slug_team: string;
}
