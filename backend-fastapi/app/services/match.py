from typing import List, Optional
from app.domain.services.match import IMatchService
from app.domain.repositories.match import IMatchRepository
from app.domain.repositories.coach import ICoachRepository
from app.domain.repositories.analyst import IAnalystRepository
from app.domain.repositories.set import ISetRepository
from app.domain.dtos.match import MatchDTO

class MatchService(IMatchService):
    def __init__(
        self, 
        match_repository: IMatchRepository,
        coach_repository: ICoachRepository,
        analyst_repository: IAnalystRepository,
        set_repository: ISetRepository
    ):
        self._match_repository = match_repository
        self._coach_repository = coach_repository
        self._analyst_repository = analyst_repository
        self._set_repository = set_repository

    async def get_user_next_match(self, session, email: str, role: str) -> Optional[MatchDTO]:
        """
        Obtiene el próximo partido basándose en el id_team del Coach o Analyst,
        aplicando lógicas diferentes según el rol.
        """
        id_team = None
        role_lower = role.lower()

        # 1. Obtenemos el usuario según el rol para extraer su id_team
        if role_lower == "coach":
            user = await self._coach_repository.get_by_email(session, email)
            id_team = user.id_team if user else None
            
        elif role_lower == "analyst":
            user = await self._analyst_repository.get_by_email(session, email)
            id_team = user.id_team if user else None

        if id_team is None:
            return None

        if role_lower == "analyst":
            return await self._match_repository.get_next_match_by_team_id_analyst(session, id_team)
        
        return await self._match_repository.get_next_match_by_team_id(session, id_team)

    async def get_league_matches(self, session, league_slug: str) -> List[MatchDTO]:
        """Obtiene todos los partidos de una liga mediante su slug."""
        return await self._match_repository.get_matches_by_league_slug(session, league_slug)
    
    async def start_match(self, session, match_slug: str, role: str) -> str:
        """
        Lógica para iniciar un partido:
        1. Verificar rol Analyst.
        2. Verificar existencia del Match.
        3. Verificar estado actual (evitar errores si ya es live/finished).
        4. Verificar existencia del Set actual.
        5. Actualizar ambos a 'live'.
        """
        # 1. Verificar que es tipo analyst
        if role.lower() != "analyst":
            raise PermissionError("Solo los analistas pueden iniciar el partido")

        # 2. Verificar si existe el match
        match_model = await self._match_repository.get_model_by_slug(session, match_slug)
        if not match_model:
            return "MATCH_NOT_FOUND" # El service devuelve un código que el router traduce a 404

        # 3. Validaciones de estado del match
        if match_model.status == "live":
            return "Partido ya iniciado"
        if match_model.status == "finished":
            return "El partido ya ha finalizado y no se puede reabrir"

        # 4. Verificar si existe el set actual del match
        set_model = await self._set_repository.get_actual_set_model_by_match_slug(session, match_slug)
        if not set_model:
            return "SET_NOT_FOUND"

        # 5. Modificar estados
        match_model.status = "live"
        await self._set_repository.update_set_status(session, set_model, "live")
        
        # Como usamos el context_session, el commit se hará automáticamente al salir del bloque 'async with' del router
        return "Partido empezado correctamente"