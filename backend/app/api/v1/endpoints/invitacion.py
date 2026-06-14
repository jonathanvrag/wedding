"""
Public invitation endpoints.
Following fastapi-templates endpoint pattern.
"""
from fastapi import APIRouter, HTTPException, status

from app.schemas.invitado import (
    InvitacionResponse,
    RSVPRequest,
    RSVPResponse
)
from app.services.invitado_service import invitado_service

router = APIRouter(tags=["invitacion"])


@router.get("/{codigo}", response_model=InvitacionResponse)
async def get_invitacion(codigo: str):
    """Get invitation data for a specific guest."""
    invitacion = invitado_service.get_by_code(codigo)
    
    if not invitacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitación no encontrada"
        )
    
    return invitacion


@router.post("/rsvp", response_model=RSVPResponse)
async def submit_rsvp(request: RSVPRequest):
    """Submit RSVP confirmation."""
    # Check deadline via service (per-guest then global fallback)
    is_expired, message = invitado_service._check_deadline(request.codigo)
    if is_expired:
        raise HTTPException(status_code=status.HTTP_410_GONE, detail=message)
    
    try:
        result = invitado_service.submit_rsvp(
            codigo=request.codigo,
            confirmo=request.confirmo,
            cantidad=request.cantidad,
            asistentes=request.asistentes,
            restricciones=request.restricciones
        )
        return RSVPResponse(**result)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
