"""
API v1 router.
Following fastapi-templates pattern.
"""
from fastapi import APIRouter

from app.api.v1.endpoints import invitacion, admin

api_router = APIRouter()

# Include endpoints
api_router.include_router(invitacion.router, prefix="/invitacion", tags=["Invitación"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])