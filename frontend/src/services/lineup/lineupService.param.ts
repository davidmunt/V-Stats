export interface SaveLineupParam {
  slug_match: string;
  slug_team: string;
  positions: {
    slug_player: string;
    position: number;
  }[];
}

export interface UpdateLineupPositionParam {
  slug_position: string;
  slug_player: string;
}
