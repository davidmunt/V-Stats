import apiClient from "@/services/apiClient";
import type { CreateMatchParam, UpdateMatchParam } from "./matchService.param";
import type { Match } from "@/interfaces/match.interface";
import type { Team } from "@/interfaces/team.interface";

interface MatchesResponse {
  matches: Match[];
}

interface SingleMatchResponse {
  match: Match;
}

interface TeamsResponse {
  teams: Team[];
}

export const createMatch = async ({
  slug_league,
  name,
  image,
  slug_team_local,
  slug_team_visitor,
  date,
}: CreateMatchParam): Promise<Match> => {
  const response = await apiClient.post<SingleMatchResponse>("spring", `/api/matches/${slug_league}`, {
    name,
    image,
    slug_team_local,
    slug_team_visitor,
    date,
  });
  return response.data.match;
};

export const updateMatch = async ({
  slug_league,
  name,
  image,
  slug_match,
  slug_team_local,
  slug_team_visitor,
  date,
  status,
  is_active,
}: UpdateMatchParam): Promise<Match> => {
  const response = await apiClient.put<SingleMatchResponse>("spring", `/api/matches/${slug_match}`, {
    slug_league,
    name,
    image,
    slug_team_local,
    slug_team_visitor,
    date,
    status,
    is_active,
  });
  return response.data.match;
};

export const deleteMatch = async ({ matchSlug }: { matchSlug: string }): Promise<void> => {
  await apiClient.delete<void>("spring", `/api/matches/${matchSlug}`);
};

export const getMatchesFromLeague = async (slug: string): Promise<Match[]> => {
  const response = await apiClient.get<MatchesResponse>("spring", `/api/matches/league/${slug}`);
  return response.data.matches;
};

export const getMatchesForCoach = async (slug: string): Promise<Match[]> => {
  const response = await apiClient.get<MatchesResponse>("fastapi", `/api/matches/team/${slug}`);
  return response.data.matches;
};

export const getNextMatchForCoach = async (): Promise<Match> => {
  const response = await apiClient.get<SingleMatchResponse>("fastapi", `/api/matches/next`);
  return response.data.match;
};

export const getNextMatchForAnalyst = async (): Promise<Match> => {
  const response = await apiClient.get<SingleMatchResponse>("fastapi", `/api/matches/next`);
  return response.data.match;
};

export const getTeamsFromMatch = async (slug: string): Promise<Team[]> => {
  const response = await apiClient.get<TeamsResponse>("fastapi", `/api/teams/${slug}/match`);
  return response.data.teams;
};

export const startMatch = async (matchSlug: string): Promise<void> => {
  await apiClient.patch("fastapi", `/api/matches/${matchSlug}/start`);
};

export const getMatchBySlug = async (slug: string): Promise<Match> => {
  const response = await apiClient.get<SingleMatchResponse>("express", `/match/${slug}`);
  return response.data.match;
};
