from pydantic import BaseModel
from typing import List

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


class ActionResultBreakdownStatsResponse(BaseModel):
    percentage_serve_double_plus: float = 0.0
    percentage_serve_plus: float = 0.0
    percentage_serve_minus: float = 0.0
    percentage_serve_double_minus: float = 0.0
    percentage_attack_double_plus: float = 0.0
    percentage_attack_plus: float = 0.0
    percentage_attack_minus: float = 0.0
    percentage_attack_double_minus: float = 0.0
    percentage_block_double_plus: float = 0.0
    percentage_block_plus: float = 0.0
    percentage_block_minus: float = 0.0
    percentage_block_double_minus: float = 0.0
    percentage_reception_double_plus: float = 0.0
    percentage_reception_plus: float = 0.0
    percentage_reception_minus: float = 0.0
    percentage_reception_double_minus: float = 0.0
    percentage_colocacion_double_plus: float = 0.0
    percentage_colocacion_plus: float = 0.0
    percentage_colocacion_minus: float = 0.0
    percentage_colocacion_double_minus: float = 0.0
    percentage_defensa_double_plus: float = 0.0
    percentage_defensa_plus: float = 0.0
    percentage_defensa_minus: float = 0.0
    percentage_defensa_double_minus: float = 0.0

    @classmethod
    def from_dto(cls, dto):
        payload = {
            key: value
            for key, value in dto.__dict__.items()
            if key.startswith("percentage_")
        }
        return cls(**payload)


class TeamActionResultBreakdownResponse(BaseModel):
    stats: ActionResultBreakdownStatsResponse

    @classmethod
    def from_dto(cls, dto):
        return cls(stats=ActionResultBreakdownStatsResponse.from_dto(dto.stats))


class PlayerActionResultBreakdownResponse(BaseModel):
    stats: ActionResultBreakdownStatsResponse

    @classmethod
    def from_dto(cls, dto):
        return cls(stats=ActionResultBreakdownStatsResponse.from_dto(dto.stats))


class TeamActionResultBreakdownByMatchResponse(BaseModel):
    stats: ActionResultBreakdownStatsResponse

    @classmethod
    def from_dto(cls, dto):
        return cls(stats=ActionResultBreakdownStatsResponse.from_dto(dto.stats))


class PlayerActionResultBreakdownByMatchResponse(BaseModel):
    stats: ActionResultBreakdownStatsResponse

    @classmethod
    def from_dto(cls, dto):
        return cls(stats=ActionResultBreakdownStatsResponse.from_dto(dto.stats))
