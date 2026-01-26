import apiClient from "@/services/apiClient";
import type { CreateMatchParam, UpdateMatchParam } from "./matchService.param";
import type { Match } from "@/interfaces/match.interface";

interface MatchesResponse {
  matches: Match[];
}

interface SingleMatchResponse {
  match: Match;
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

export const getMatchBySlug = async (slug: string): Promise<Match> => {
  const response = await apiClient.get<SingleMatchResponse>(`/match/${slug}`);
  return response.data.match;
};
