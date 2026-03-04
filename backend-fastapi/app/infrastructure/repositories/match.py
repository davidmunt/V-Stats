from typing import List, Optional
from datetime import datetime, time
from sqlalchemy import select, or_, and_
from sqlalchemy.orm import aliased, selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.match import IMatchRepository
from app.domain.dtos.match import MatchDTO
from app.infrastructure.models.match import Match
from app.infrastructure.models.league import League
from app.infrastructure.models.team import Team
from app.infrastructure.models.set import Set
from app.domain.mapper import IModelMapper

class MatchRepository(IMatchRepository):
    def __init__(self, match_mapper: IModelMapper):
        self.mapper = match_mapper

    async def get_next_match_by_team_id(self, session: AsyncSession, team_id: int) -> Optional[MatchDTO]:
        now = datetime.now()
        query = (
            select(Match)
            .where(
                and_(
                    or_(Match.id_local_team == team_id, Match.id_visitor_team == team_id),
                    Match.date >= now,
                    Match.status == "scheduled",
                    Match.is_active == True
                )
            )
            .order_by(Match.date.asc())
            .limit(1)
            .options(
                selectinload(Match.league),
                selectinload(Match.local_team),
                selectinload(Match.visitor_team),
                selectinload(Match.venue),
                # --- ESTA ES LA LÍNEA QUE FALTA ---
                selectinload(Match.sets) 
            )
        )
        result = await session.execute(query)
        match_model = result.scalar_one_or_none()
        
        # Ahora, cuando el mapper haga model.sets, ya estarán cargados y no dará error
        return self.mapper.to_dto(match_model)
    
    async def get_next_match_by_team_id_analyst(self, session: AsyncSession, team_id: int) -> Optional[MatchDTO]:
        # --- 1. CONSULTA PARA PARTIDO EN VIVO ---
        query_live = (
            select(Match)
            .where(
                and_(
                    or_(Match.id_local_team == team_id, Match.id_visitor_team == team_id),
                    Match.status == "live",
                    Match.is_active == True
                )
            )
            .options(
                selectinload(Match.league),
                selectinload(Match.local_team),
                selectinload(Match.visitor_team),
                selectinload(Match.venue),
                selectinload(Match.sets) # <--- AÑADIR AQUÍ
            )
            .limit(1)
        )
        
        result = await session.execute(query_live)
        match_model = result.scalar_one_or_none()

        # --- 2. SI NO HAY LIVE, BUSCAMOS EL PRÓXIMO SCHEDULED ---
        if not match_model:
            today_start = datetime.combine(datetime.now().date(), time.min)
            
            query_scheduled = (
                select(Match)
                .where(
                    and_(
                        or_(Match.id_local_team == team_id, Match.id_visitor_team == team_id),
                        Match.status == "scheduled",
                        Match.date >= today_start,
                        Match.is_active == True
                    )
                )
                .order_by(Match.date.asc())
                .options(
                    selectinload(Match.league),
                    selectinload(Match.local_team),
                    selectinload(Match.visitor_team),
                    selectinload(Match.venue),
                    selectinload(Match.sets) # <--- AÑADIR TAMBIÉN AQUÍ
                )
                .limit(1)
            )
            
            result = await session.execute(query_scheduled)
            match_model = result.scalar_one_or_none()

        # Ahora el Mapper encontrará los sets precargados y no fallará
        return self.mapper.to_dto(match_model)

    async def get_matches_by_league_slug(self, session: AsyncSession, league_slug: str) -> List[MatchDTO]:
        """
        Obtiene todos los partidos de una liga filtrando por el slug de la misma.
        """
        query = (
            select(Match)
            .join(League)
            .where(League.slug == league_slug)
            .options(
                selectinload(Match.league),
                selectinload(Match.local_team),
                selectinload(Match.visitor_team),
                selectinload(Match.venue)
            )
            .order_by(Match.date.desc())
        )
        result = await session.execute(query)
        matches = result.scalars().all()
        return [self.mapper.to_dto(m) for m in matches]
    
    async def get_matches_by_team(self, session: AsyncSession, team_slug: str) -> List[MatchDTO]:
        """
        Obtiene todos los partidos donde el equipo (local o visitante) coincida con el slug.
        """
        # Creamos alias para la tabla Team para unirla dos veces
        LocalTeam = aliased(Team)
        VisitorTeam = aliased(Team)

        query = (
            select(Match)
            .join(LocalTeam, Match.id_local_team == LocalTeam.id_team)
            .join(VisitorTeam, Match.id_visitor_team == VisitorTeam.id_team)
            .where(
                or_(
                    LocalTeam.slug == team_slug,
                    VisitorTeam.slug == team_slug
                )
            )
            .options(
                selectinload(Match.sets),
                selectinload(Match.league),
                selectinload(Match.local_team),
                selectinload(Match.visitor_team),
                selectinload(Match.venue)
            )
            .order_by(Match.date.desc())
        )
        
        result = await session.execute(query)
        matches = result.scalars().unique().all()
        
        # IMPORTANTE: Mapear a DTO antes de devolver, para mantener consistencia
        return [self.mapper.to_dto(m) for m in matches]
    
    async def get_model_by_slug(self, session: AsyncSession, slug: str) -> Optional[Match]:
        """
        Obtiene el modelo SQLAlchemy directamente. 
        Útil para operaciones de escritura (PATCH/PUT) en el Service.
        """
        query = select(Match).where(Match.slug == slug)
        result = await session.execute(query)
        return result.scalar_one_or_none()
    
    async def update_match_status(self, session: AsyncSession, match_slug: str, new_status: str) -> Optional[MatchDTO]:
        """
        Busca el partido por slug y actualiza su estado.
        """
        match = await self.get_model_by_slug(session, match_slug)
        if match:
            match.status = new_status
            await session.flush() 
            return self.mapper.to_dto(match)
        return None
    
    async def get_by_slug_model(self, session: AsyncSession, slug: str) -> Optional[Match]:
        query = select(Match).where(Match.slug == slug)
        result = await session.execute(query)
        return result.scalar_one_or_none()
    
    async def get_finished_matches_by_league_id(self, session: AsyncSession, id_league: int) -> List[MatchDTO]:
        query = (
            select(Match)
            .where(
                Match.id_league == id_league,
                Match.status == "finished"
            )
            .options(
                selectinload(Match.sets), # Carga los sets de forma eficiente
                selectinload(Match.league),
                selectinload(Match.local_team),
                selectinload(Match.visitor_team)
            )
        )
        result = await session.execute(query)
        # .unique() es obligatorio cuando usas selectinload/joinedload para no duplicar filas
        matches = result.scalars().unique().all() 
        return [self.mapper.to_dto(m) for m in matches]