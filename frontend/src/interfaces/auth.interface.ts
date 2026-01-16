import type { User } from "./user.interface";

export interface Auth {
  accessToken: string;
  user: User;
}
