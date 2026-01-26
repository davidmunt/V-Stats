export interface CreatePlayerParam {
  slug: string;
  name: string;
  dorsal: number;
  role: string;
  image: string;
}

export interface UpdatePlayerParam {
  slug: string;
  name: string;
  dorsal: number;
  role: string;
  image: string;
  status: string;
  is_active: boolean;
}
