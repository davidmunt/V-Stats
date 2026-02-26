import contextlib
from collections.abc import AsyncIterator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.core.config import get_app_settings
from app.core.settings.base import BaseAppSettings

from app.infrastructure.mappers.coach import CoachModelMapper
from app.infrastructure.repositories.coach import CoachRepository
from app.services.coach import CoachService
from app.infrastructure.mappers.analyst import AnalystModelMapper
from app.infrastructure.repositories.analyst import AnalystRepository
from app.services.analyst import AnalystService
from app.infrastructure.mappers.league import LeagueModelMapper
from app.infrastructure.repositories.league import LeagueRepository
from app.services.league import LeagueService
from app.infrastructure.mappers.match import MatchModelMapper
from app.infrastructure.repositories.match import MatchRepository
from app.services.match import MatchService
from app.infrastructure.mappers.set import SetModelMapper
from app.infrastructure.repositories.set import SetRepository
from app.services.set import SetService
from app.infrastructure.mappers.team import TeamModelMapper
from app.infrastructure.repositories.team import TeamRepository
from app.services.team import TeamService

class Container:
    """Dependency injector project container for V-Stats."""

    def __init__(self, settings: BaseAppSettings) -> None:
        self._settings = settings
        self._engine = create_async_engine(**settings.sqlalchemy_engine_props)
        self._session = async_sessionmaker(bind=self._engine, expire_on_commit=False)

    @contextlib.asynccontextmanager
    async def context_session(self) -> AsyncIterator[AsyncSession]:
        session = self._session()
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

    # --- COACH ---
    @staticmethod
    def coach_model_mapper():
        return CoachModelMapper()

    def coach_repository(self):
        return CoachRepository(coach_mapper=self.coach_model_mapper())

    def coach_service(self):
        return CoachService(coach_repository=self.coach_repository())
    
    # --- ANALYST ---
    @staticmethod    
    def analyst_model_mapper():
        return AnalystModelMapper()

    def analyst_repository(self):
        return AnalystRepository(analyst_mapper=self.analyst_model_mapper())

    def analyst_service(self):
        return AnalystService(analyst_repository=self.analyst_repository())
    
    # --- LEAGUE ---
    @staticmethod    
    def league_model_mapper():
        return LeagueModelMapper()

    def league_repository(self):
        # Usamos 'mapper' porque así lo definimos en el __init__ de LeagueRepository
        return LeagueRepository(mapper=self.league_model_mapper())

    def league_service(self):
        return LeagueService(
            coach_repo=self.coach_repository(),
            analyst_repo=self.analyst_repository(),
            team_repo=self.team_repository(),
            league_repo=self.league_repository()
        )
    
    # --- MATCH ---
    @staticmethod    
    def match_model_mapper():
        return MatchModelMapper()

    def match_repository(self):
        # Usamos 'match_mapper' porque así está en el repo de infraestructura
        return MatchRepository(match_mapper=self.match_model_mapper())

    def match_service(self):
        return MatchService(
            match_repository=self.match_repository(),
            coach_repository=self.coach_repository(),
            analyst_repository=self.analyst_repository(),
            set_repository=self.set_repository()
        )
    
    # --- SET ---
    @staticmethod    
    def set_model_mapper():
        return SetModelMapper()

    def set_repository(self):
        return SetRepository(set_mapper=self.set_model_mapper())

    def set_service(self):
        return SetService(set_repository=self.set_repository())
    
    # --- TEAM ---
    @staticmethod
    def team_model_mapper():
        return TeamModelMapper()

    def team_repository(self):
        return TeamRepository(team_mapper=self.team_model_mapper())
    
    def team_service(self):
        return TeamService(team_repository=self.team_repository())

container_instance = Container(settings=get_app_settings())