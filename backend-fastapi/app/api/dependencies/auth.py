from fastapi import Depends, HTTPException, status
from app.core.auth import get_current_user_data

class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user_data: dict = Depends(get_current_user_data)):
        user_role = user_data.get("role")
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acceso denegado. Se requiere rol: {self.allowed_roles}"
            )
        return user_data