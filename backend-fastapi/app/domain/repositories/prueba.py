import abc
from typing import Any

from app.domain.dtos.prueba import CreatePruebaDTO, PruebaDTO


class IPruebaRepository(abc.ABC):
    """Prueba repository interface."""

    @abc.abstractmethod
    async def add(
        self, session: Any, create_item: CreatePruebaDTO
    ) -> PruebaDTO:
        ...

    @abc.abstractmethod
    async def get_by_id_or_none(
        self, session: Any, prueba_id: int
    ) -> PruebaDTO | None:
        ...

    @abc.abstractmethod
    async def get_by_id(
        self, session: Any, prueba_id: int
    ) -> PruebaDTO:
        ...

    @abc.abstractmethod
    async def delete_by_id(
        self, session: Any, prueba_id: int
    ) -> None:
        ...
