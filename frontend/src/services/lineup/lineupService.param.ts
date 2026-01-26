export interface SaveLineupParam {
  matchSlug: string;
  teamSlug: string;
  positions: {
    player_id: string;
    position: number;
  }[];
}

export interface UpdateLineupPositionParam {
  positionSlug: string;
  player_id: string;
}
