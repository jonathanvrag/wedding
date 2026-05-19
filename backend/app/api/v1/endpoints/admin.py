"""
Admin endpoints with authentication.
Following fastapi-templates endpoint pattern with dependencies.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional

from app.core.config import get_settings
from app.core.security import decode_token
from app.schemas.invitado import (
    LoginRequest,
    LoginResponse,
    NuevoInvitado,
    InvitadoResponse,
    StatsResponse
)
from app.services.invitado_service import invitado_service

router = APIRouter(tags=["admin"])
security = HTTPBearer()

settings = get_settings()


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Verify admin JWT token."""
    token = credentials.credentials
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    
    return payload.get("sub", "")


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Admin authentication."""
    if request.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta"
        )
    
    from app.core.security import create_access_token
    from datetime import timedelta
    
    token = create_access_token(
        {"sub": "admin"},
        expires_delta=timedelta(days=settings.JWT_EXPIRE_DAYS)
    )
    
    return LoginResponse(token=token, message="Login exitoso")


@router.get("/invitados", response_model=List[InvitadoResponse])
async def get_invitados(
    categoria: Optional[str] = None,
    confirmo: Optional[str] = None,
    search: Optional[str] = None,
    current_admin: str = Depends(get_current_admin)
):
    """Get all guests with filters."""
    return invitado_service.get_all(
        categoria=categoria,
        confirmo=confirmo,
        search=search
    )


@router.post("/invitados", response_model=InvitadoResponse)
async def create_invitado(
    nuevo: NuevoInvitado,
    current_admin: str = Depends(get_current_admin)
):
    """Create new guest."""
    try:
        return invitado_service.create(nuevo)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put("/invitados/{guest_id}", response_model=InvitadoResponse)
async def update_invitado(
    guest_id: str,
    updates: NuevoInvitado,
    current_admin: str = Depends(get_current_admin)
):
    """Update guest."""
    try:
        return invitado_service.update(guest_id, updates)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.delete("/invitados/{guest_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_invitado(
    guest_id: str,
    current_admin: str = Depends(get_current_admin)
):
    """Delete guest."""
    try:
        invitado_service.delete(guest_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/stats", response_model=StatsResponse)
async def get_stats(
    current_admin: str = Depends(get_current_admin)
):
    """Get RSVP statistics."""
    return StatsResponse(**invitado_service.get_stats())


@router.get("/config")
async def get_config(
    current_admin: str = Depends(get_current_admin)
):
    """Get evento configuration."""
    return invitado_service.get_config()


@router.put("/config")
async def update_config(
    config: dict,
    current_admin: str = Depends(get_current_admin)
):
    """Update evento configuration."""
    return invitado_service.save_config(config)