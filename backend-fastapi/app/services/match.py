from typing import List, Optional
from app.domain.services.match import IMatchService
from app.domain.repositories.match import IMatchRepository
from app.domain.repositories.coach import ICoachRepository
from app.domain.repositories.analyst import IAnalystRepository
from app.domain.dtos.match import MatchDTO

class MatchService(IMatchService):
    def __init__(
        self, 
        match_repository: IMatchRepository,
        coach_repository: ICoachRepository,
        analyst_repository: IAnalystRepository
    ):
        self._match_repository = match_repository
        self._coach_repository = coach_repository
        self._analyst_repository = analyst_repository

    async def get_user_next_match(self, session, email: str, role: str) -> Optional[MatchDTO]:
        """
        Obtiene el próximo partido basándose en el id_team del Coach o Analyst.
        """
        id_team = None
        role_lower = role.lower()

        print(f"-1: DEBUG: Email: {email} | Equipo encontrado: {id_team}")


        # 1. Obtenemos el usuario según el rol para extraer su id_team
        if role_lower == "coach":
            user = await self._coach_repository.get_by_email(session, email)
            id_team = user.id_team if user else None
            
        elif role_lower == "analyst":
            user = await self._analyst_repository.get_by_email(session, email)
            id_team = user.id_team if user else None

        # 2. Si el usuario no tiene equipo o el rol no es válido para esta acción, retornamos None
        if id_team is None:
            return None

        # 3. Buscamos en el repositorio de partidos el más cercano
        print(f"-2: DEBUG: Email: {email} | Equipo encontrado: {id_team}")
        return await self._match_repository.get_next_match_by_team_id(session, id_team)

    async def get_league_matches(self, session, league_slug: str) -> List[MatchDTO]:
        """
        Obtiene todos los partidos de una liga mediante su slug.
        """
        return await self._match_repository.get_matches_by_league_slug(session, league_slug)