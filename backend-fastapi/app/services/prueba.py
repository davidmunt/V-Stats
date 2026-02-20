from dataclasses import asdict
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.dtos.prueba import PruebaDTO, CreatePruebaDTO, UpdatePruebaDTO
from app.domain.repositories.prueba import IPruebaRepository
from app.domain.services.prueba import IPruebaService


class PruebaService(IPruebaService):
    """Service para manejar la lógica de la entidad de prueba."""

    def __init__(self, prueba_repo: IPruebaRepository) -> None:
        self._prueba_repo = prueba_repo

    async def create_new_prueba(
        self, session: AsyncSession, create_dto: CreatePruebaDTO
    ) -> PruebaDTO:
        # Llama al repositorio para crear la entidad
        prueba = await self._prueba_repo.add(session=session, create_item=create_dto)
        return PruebaDTO(**asdict(prueba))

    async def get_prueba_by_id(
        self, session: AsyncSession, prueba_id: int
    ) -> PruebaDTO | None:
        prueba = await self._prueba_repo.get_by_id(session=session, prueba_id=prueba_id)
        if prueba is None:
            return None
        return PruebaDTO(**asdict(prueba))

    async def update_prueba(
        self, session: AsyncSession, prueba_id: int, update_dto: UpdatePruebaDTO
    ) -> PruebaDTO:
        updated = await self._prueba_repo.update_by_id(
            session=session, prueba_id=prueba_id, update_item=update_dto
        )
        return PruebaDTO(**asdict(updated))

    async def delete_prueba(
        self, session: AsyncSession, prueba_id: int
    ) -> None:
        await self._prueba_repo.delete_by_id(session=session, prueba_id=prueba_id)
