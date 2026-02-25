export interface CreatePlayerParam {
  slug_team: string;
  name: string;
  dorsal: number;
  role: string;
  image: string;
}

export interface UpdatePlayerParam {
  slug_player: string;
  name: string;
  dorsal: number;
  role: string;
  image: string;
  status: string;
  is_active: boolean;
}
