import base64  
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import get_app_settings

settings = get_app_settings()
security = HTTPBearer()

def get_current_user_data(res: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = res.credentials
    try:
        secret_bytes = base64.b64decode(settings.jwt_secret_key)
        
        payload = jwt.decode(
            token, 
            secret_bytes,  
            algorithms=[settings.jwt_algorithm]
        )
        
        user_email: str = payload.get("sub") 
        user_role: str = payload.get("role")
        
        if user_email is None or user_role is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="El token no contiene el email o el rol necesario",
            )
            
        return payload 
        
    except JWTError as e:
        print(f"Error validando JWT: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido, expirado o firma incorrecta",
        )