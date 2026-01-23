export interface TeamStanding {
  id_team: string;
  slug: string;
  name: string;
  image: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  sets_won: number;
  sets_lost: number;
  points_favor: number;
  points_against: number;
  points_diff: number;
}
