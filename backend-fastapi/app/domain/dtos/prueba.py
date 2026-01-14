from dataclasses import dataclass


@dataclass(frozen=True)
class CreatePruebaDTO:
    description: str


@dataclass(frozen=True)
class PruebaDTO:
    id_prueba: int
    description: str
