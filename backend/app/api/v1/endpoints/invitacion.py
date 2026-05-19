"""
Public invitation endpoints.
Following fastapi-templates endpoint pattern.
"""
from datetime import datetime, timedelta
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
    # Verificar si la fecha límite ya pasó
    config = invitado_service.get_config()
    fecha_limite = config.get('fecha_limite_confirmacion', '')
    
    print(f"DEBUG: fecha_limite = '{fecha_limite}'")
    print(f"DEBUG: config keys = {list(config.keys())}")
    print(f"DEBUG: fecha_limite type = {type(fecha_limite)}")
    print(f"DEBUG: fecha_limite repr = {repr(fecha_limite)}")
    
    if fecha_limite and len(fecha_limite) == 10:
        try:
            # fecha_limite viene en formato YYYY-MM-DD
            fecha_limite_dt = datetime.strptime(fecha_limite, '%Y-%m-%d')
            # Agregar hasta fin del día
            fecha_limite_dt = fecha_limite_dt + timedelta(hours=23, minutes=59)
            
            print(f"DEBUG: fecha_limite_dt = {fecha_limite_dt}")
            print(f"DEBUG: datetime.now() = {datetime.now()}")
            print(f"DEBUG: now > limite = {datetime.now() > fecha_limite_dt}")
            print(f"DEBUG: now timestamp = {datetime.now().timestamp()}")
            print(f"DEBUG: limite timestamp = {fecha_limite_dt.timestamp()}")
            
            if datetime.now() > fecha_limite_dt:
                # Formatear fecha para mostrar
                fecha_formato = fecha_limite_dt.strftime('%d de %B de %Y')
                raise HTTPException(
                    status_code=status.HTTP_410_GONE,
                    detail=f"El plazo de confirmación terminó el {fecha_formato}. Ya no es posible confirmar asistencia."
                )
        except ValueError as e:
            print(f"DEBUG: ValueError - {e}")
            # Si el formato no es válido, permitir la confirmación
            pass
    
    try:
        result = invitado_service.submit_rsvp(
            codigo=request.codigo,
            confirmo=request.confirmo,
            cantidad=request.cantidad,
            acompanantes=request.acompanantes
        )
        return RSVPResponse(**result)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
