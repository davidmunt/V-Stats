export interface LoginParam {
  email: string;
  password: string;
}

export interface RegisterParam {
  name: string;
  email: string;
  password: string;
  user_type: "ADMIN" | "COACH" | "ANALIST" | "PLAYER" | "USER";
}

export interface UpdateUserParam {
  name: string;
  email: string;
  avatar?: string;
  dark_mode?: boolean;
  password?: string;
}
