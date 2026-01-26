import type { UserRole } from "./user.interface";

export interface Auth {
  token: string;
  user_type: UserRole;
  email: string;
  name: string;
  id: string;
  avatar: string;
  slug: string;
}
