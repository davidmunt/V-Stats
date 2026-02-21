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

class Container:
    """Dependency injector project container for V-Stats."""

    def __init__(self, settings: BaseAppSettings) -> None:
        self._settings = settings
        self._engine = create_async_engine(**settings.sqlalchemy_engine_props)
        self._session = async_sessionmaker(bind=self._engine, expire_on_commit=False)

    @contextlib.asynccontextmanager
    async def context_session(self) -> AsyncIterator[AsyncSession]:
        """Proporciona una sesión asíncrona con gestión de transacciones."""
        session = self._session()
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

    @staticmethod
    def coach_model_mapper():
        return CoachModelMapper()

    def coach_repository(self):
        return CoachRepository(coach_mapper=self.coach_model_mapper())

    def coach_service(self):
        return CoachService(coach_repository=self.coach_repository())
    
    @staticmethod    
    def analyst_model_mapper():
        return AnalystModelMapper()

    def analyst_repository(self):
        return AnalystRepository(analyst_mapper=self.analyst_model_mapper())

    def analyst_service(self):
        return AnalystService(analyst_repository=self.analyst_repository())

container_instance = Container(settings=get_app_settings())