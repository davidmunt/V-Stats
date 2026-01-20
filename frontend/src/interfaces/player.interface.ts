export type PlayerRole = "SETTER" | "MIDDLE" | "OUTSIDE" | "OPPOSITE" | "LIBERO";
export type PlayerStatus = "ACTIVE" | "INACTIVE" | "INJURED" | "SUSPENDED";

export interface Player {
  id_player: string;
  id_team: string;
  name: string;
  dorsal: number;
  role: PlayerRole;
  image: string;
  status: PlayerStatus;
  is_active: boolean;
}
