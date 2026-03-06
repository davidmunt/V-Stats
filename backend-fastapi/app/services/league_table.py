from app.domain.repositories.team import ITeamRepository
from app.domain.repositories.league import ILeagueRepository
from app.domain.repositories.set import ISetRepository
from app.domain.services.league_table import ILeagueStandingService
from app.api.schemas.responses.league_table import LeagueTableResponse
from typing import List, Optional

class LeagueStandingService(ILeagueStandingService):
    def __init__(self, league_repo, team_repo, match_repo, set_repo):
        self._league_repo = league_repo
        self._team_repo = team_repo
        self._match_repo = match_repo
        self._set_repo = set_repo

    async def get_league_standings(self, session, league_slug: str):
        league_id = await self._league_repo.get_league_id_by_slug(session, league_slug)
        if league_id is None:
            raise ValueError("Liga no encontrada.")

        teams = await self._team_repo.get_by_league_id(session, league_id)
        matches = await self._match_repo.get_finished_matches_by_league_id(session, league_id)
        
        standings = []
        for team in teams:
            stats = {
                "slug_team": team.slug_team, "name": team.name, "image": team.image,
                "played": 0, "won": 0, "lost": 0, "points": 0,
                "sets_won": 0, "sets_lost": 0, "points_favor": 0,
                "points_against": 0, "points_diff": 0
            }

            for m in matches:
                if team.id_team in [m.id_local_team, m.id_visitor_team]:
                    stats["played"] += 1
                    is_local = (team.id_team == m.id_local_team)
                    
                    t_sets, o_sets = 0, 0
                    for s in m.sets:
                        t_pts = s.local_points if is_local else s.visitor_points
                        o_pts = s.visitor_points if is_local else s.local_points
                        
                        stats["points_favor"] += t_pts
                        stats["points_against"] += o_pts
                        
                        if t_pts > o_pts: t_sets += 1
                        else: o_sets += 1

                    stats["sets_won"] += t_sets
                    stats["sets_lost"] += o_sets
                    
                    if t_sets > o_sets:
                        stats["won"] += 1
                        stats["points"] += 3 if (t_sets - o_sets) > 1 else 2
                    else:
                        stats["lost"] += 1
                        stats["points"] += 1 if (o_sets - t_sets) == 1 else 0

            stats["points_diff"] = stats["points_favor"] - stats["points_against"]
            standings.append(stats)

        return sorted(standings, key=lambda x: (x["points"], x["won"]), reverse=True)