export interface LoginParam {
  email: string;
  password: string;
}

export interface RegisterParam {
  name: string;
  email: string;
  password: string;
  user_type: "admin" | "coach" | "analyst" | "player" | "user";
}

export interface UpdateUserParam {
  name: string;
  email: string;
  avatar?: string;
  dark_mode?: boolean;
  password?: string;
}
