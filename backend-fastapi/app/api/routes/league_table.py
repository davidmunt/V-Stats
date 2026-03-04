import traceback

from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api.schemas.responses.league_table import LeagueTableResponse
from app.core.container import container_instance

router = APIRouter()

def get_league_standing_service():
    return container_instance.league_standing_service()

@router.get("/{league_slug}", response_model=List[LeagueTableResponse])
async def get_league_table(
    league_slug: str,
    service = Depends(get_league_standing_service)
):
    async with container_instance.context_session() as session:
        try:
            standings = await service.get_league_standings(session, league_slug)
            return standings
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))
        except Exception as e:
            traceback.print_exc() # Esto imprime el error detallado en la consola
            raise HTTPException(
                status_code=500, 
                detail=f"Error: {type(e).__name__} - {str(e)}"
            )