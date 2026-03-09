from pydantic import BaseModel
from typing import List, Optional

class StatGeneralResponse(BaseModel):
    slug_team: str
    percentage_success : float
    percentage_error: float
    percentage_serve_success: float
    percentage_serve_error: float
    percentage_reception_success: float
    percentage_reception_error: float
    percentage_block_success: float
    percentage_block_error: float
    percentage_attack_success: float
    percentage_attack_error: float


    @classmethod
    def from_dto(cls, dto):
        return cls(
            slug_team=dto.slug_team,
            percentage_success=dto.percentage_success,
            percentage_error=dto.percentage_error,
            percentage_serve_success=dto.percentage_serve_success,
            percentage_serve_error=dto.percentage_serve_error,
            percentage_reception_success=dto.percentage_reception_success,
            percentage_reception_error=dto.percentage_reception_error,
            percentage_block_success=dto.percentage_block_success,
            percentage_block_error=dto.percentage_block_error,
            percentage_attack_success=dto.percentage_attack_success,
            percentage_attack_error=dto.percentage_attack_error
        )

class StatsGeneralResponse(BaseModel):
    stats: List[StatGeneralResponse]
