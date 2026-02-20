from sqlalchemy import delete, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.dtos.prueba import (
    PruebaRecordDTO,
    CreatePruebaDTO,
)
from app.domain.mapper import IModelMapper
from app.infrastructure.models.prueba import Prueba


class PruebaRepository:

    def __init__(self, prueba_mapper: IModelMapper[Prueba, PruebaRecordDTO]):
        self._prueba_mapper = prueba_mapper

    async def add(
        self,
        session: AsyncSession,
        create_item: CreatePruebaDTO
    ) -> PruebaRecordDTO:
        query = (
            insert(Prueba)
            .values(
                description=create_item.description,
            )
            .returning(Prueba)
        )
        result = await session.execute(query)
        return self._prueba_mapper.to_dto(result.scalar())

    async def get_by_id_or_none(
        self,
        session: AsyncSession,
        id_prueba: int
    ) -> PruebaRecordDTO | None:
        query = select(Prueba).where(Prueba.id_prueba == id_prueba)
        if prueba := await session.scalar(query):
            return self._prueba_mapper.to_dto(prueba)

    async def get_by_id(
        self,
        session: AsyncSession,
        id_prueba: int
    ) -> PruebaRecordDTO:
        query = select(Prueba).where(Prueba.id_prueba == id_prueba)
        prueba = await session.scalar(query)

        if not prueba:
            raise Exception("Prueba not found")

        return self._prueba_mapper.to_dto(prueba)
