import abc
from typing import Any

from app.domain.dtos.prueba import CreatePruebaDTO, PruebaDTO


class IPruebaService(abc.ABC):
    """Prueba service interface."""

    @abc.abstractmethod
    async def create_prueba(
        self, session: Any, prueba_to_create: CreatePruebaDTO
    ) -> PruebaDTO:
        ...

    @abc.abstractmethod
    async def get_prueba_by_id(
        self, session: Any, prueba_id: int
    ) -> PruebaDTO:
        ...

    @abc.abstractmethod
    async def delete_prueba_by_id(
        self, session: Any, prueba_id: int
    ) -> None:
        ...
