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
  avatar: string;
}

export interface UpdatePasswordParam {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
