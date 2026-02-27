import apiClient from "@/services/apiClient";
import type { CreateTeamParam, UpdateTeamParam, DeleteTeamParam } from "./adminTeamService.param";
import type { Team } from "@/interfaces/team.interface";
import type { TeamStanding } from "@/interfaces/teamStanding.interface";

interface TeamsResponse {
  teams: Team[];
}

interface SingleTeamResponse {
  team: Team;
}

export const createTeam = async ({ slug_league, slug_venue, name, image }: CreateTeamParam): Promise<Team> => {
  const response = await apiClient.post<SingleTeamResponse>("spring", "/api/teams", {
    slug_league,
    slug_venue,
    name,
    image,
  });
  return response.data.team;
};

export const updateTeam = async ({
  slug_team,
  slug_venue,
  slug_coach,
  slug_analyst,
  name,
  image,
  status,
  is_active,
}: UpdateTeamParam): Promise<Team> => {
  const response = await apiClient.put<SingleTeamResponse>("spring", `/api/teams/${slug_team}`, {
    slug_venue,
    slug_coach,
    slug_analyst,
    name,
    image,
    status,
    is_active,
  });
  return response.data.team;
};

export const deleteTeam = async ({ slug_team }: DeleteTeamParam): Promise<void> => {
  await apiClient.delete<void>("spring", `/api/teams/${slug_team}`);
};

export const getTeamsFromLeague = async (slug_team: string): Promise<Team[]> => {
  const response = await apiClient.get<TeamsResponse>("spring", `/api/teams/league/${slug_team}`);
  return response.data.teams;
};

export const getTeamsFromMatch = async (slug_team: string): Promise<Team[]> => {
  const response = await apiClient.get<TeamsResponse>("express", `/match/${slug_team}/teams`);
  return response.data.teams;
};

export const getTeamsStandingsFromLeague = async (slug_team: string): Promise<TeamStanding[]> => {
  const response = await apiClient.get<TeamStanding[]>("fastapi", `/api/table-positions/${slug_team}`);
  return response.data;
};

export const getTeamBySlug = async (slug_team: string): Promise<Team> => {
  const response = await apiClient.get<SingleTeamResponse>("express", `/team/${slug_team}`);
  return response.data.team;
};
