from dataclasses import dataclass

@dataclass
class SubstitutionDTO:
    slug_lineup: str
    slug_player_out: str
    slug_player_in: str