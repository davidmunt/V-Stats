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

export const createMatch = async ({ slug, name, image, id_team_local, id_team_visitor, date }: CreateMatchParam): Promise<Match> => {
  const response = await apiClient.post<SingleMatchResponse>(`/match/${slug}`, {
    name,
    image,
    id_team_local,
    id_team_visitor,
    date,
  });
  return response.data.match;
};

export const updateMatch = async ({
  slug,
  name,
  image,
  matchSlug,
  id_team_local,
  id_team_visitor,
  date,
  status,
  is_active,
}: UpdateMatchParam): Promise<Match> => {
  const response = await apiClient.put<SingleMatchResponse>(`${slug}/match/${matchSlug}`, {
    slug,
    name,
    image,
    id_team_local,
    id_team_visitor,
    date,
    status,
    is_active,
  });
  return response.data.match;
};

export const deleteMatch = async ({ slug, matchSlug }: { slug: string; matchSlug: string }): Promise<void> => {
  await apiClient.delete<void>(`${slug}/match/${matchSlug}`);
};

export const getMatchesFromLeague = async (slug: string): Promise<Match[]> => {
  const response = await apiClient.get<MatchesResponse>(`/matches/${slug}`);
  return response.data.matches;
};

export const getMatchesForCoach = async (slug: string): Promise<Match[]> => {
  const response = await apiClient.get<MatchesResponse>(`/matches/coach/${slug}`);
  return response.data.matches;
};

export const getNextMatchForCoach = async (slug: string): Promise<Match> => {
  const response = await apiClient.get<SingleMatchResponse>(`/match/next/coach/${slug}`);
  return response.data.match;
};

export const getNextMatchForAnalyst = async (slug: string): Promise<Match> => {
  const response = await apiClient.get<SingleMatchResponse>(`/match/next/analyst/${slug}`);
  return response.data.match;
};

export const getTeamsFromMatch = async (slug: string): Promise<Team[]> => {
  const response = await apiClient.get<TeamsResponse>(`/match/${slug}/teams`);
  return response.data.teams;
};

export const startMatch = async (matchSlug: string): Promise<void> => {
  await apiClient.patch(`/match/${matchSlug}/start`);
};

export const getMatchBySlug = async (slug: string): Promise<Match> => {
  const response = await apiClient.get<SingleMatchResponse>(`/match/${slug}`);
  return response.data.match;
};
