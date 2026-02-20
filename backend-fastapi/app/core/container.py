import contextlib
from collections.abc import AsyncIterator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_app_settings
from app.core.settings.base import BaseAppSettings

# Solo importamos lo que realmente existe en tus carpetas
from app.infrastructure.mappers.coach import CoachModelMapper
from app.infrastructure.repositories.coach import CoachRepository
from app.services.coach import CoachService

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

    async def session(self) -> AsyncIterator[AsyncSession]:
        async with self._session() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()

    # --- MAPPERS ---
    @staticmethod
    def coach_model_mapper():
        return CoachModelMapper()

    # --- REPOSITORIES ---
    def coach_repository(self):
        return CoachRepository(coach_mapper=self.coach_model_mapper())

    # --- SERVICES ---
    def coach_service(self):
        return CoachService(coach_repository=self.coach_repository())

# Instancia global para ser usada en el wiring
container_instance = Container(settings=get_app_settings())