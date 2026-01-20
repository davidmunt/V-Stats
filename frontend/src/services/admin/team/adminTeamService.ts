import apiClient from "@/services/apiClient";
import type { CreateTeamParam, UpdateTeamParam, DeleteTeamParam } from "./adminTeamService.param";
import type { Team } from "@/interfaces/team.interface";

interface TeamsResponse {
  teams: Team[];
}

interface SingleTeamResponse {
  team: Team;
}

export const createTeam = async ({ id_league, id_venue, name, image }: CreateTeamParam): Promise<Team> => {
  const response = await apiClient.post<SingleTeamResponse>("/team", {
    id_league,
    id_venue,
    name,
    image,
  });
  return response.data.team;
};

export const updateTeam = async ({
  slug,
  id_venue,
  id_coach,
  id_analyst,
  name,
  image,
  status,
  is_active,
}: UpdateTeamParam): Promise<Team> => {
  const response = await apiClient.put<SingleTeamResponse>(`/team/${slug}`, {
    id_venue,
    id_coach,
    id_analyst,
    name,
    image,
    status,
    is_active,
  });
  return response.data.team;
};

export const deleteTeam = async ({ slug }: DeleteTeamParam): Promise<void> => {
  await apiClient.delete<void>(`/team/${slug}`);
};

export const getTeamsFromLeague = async (slug: string): Promise<Team[]> => {
  const response = await apiClient.get<TeamsResponse>(`/league/${slug}/teams`);
  return response.data.teams;
};

export const getTeamBySlug = async (slug: string): Promise<Team> => {
  const response = await apiClient.get<SingleTeamResponse>(`/team/${slug}`);
  return response.data.team;
};
