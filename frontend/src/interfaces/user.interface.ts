export type UserRole = "ADMIN" | "COACH" | "ANALIST" | "PLAYER" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  dark_mode: boolean;
  user_type: UserRole;
  accessToken: string;
}
