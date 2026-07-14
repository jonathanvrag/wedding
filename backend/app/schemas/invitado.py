"""
Pydantic schemas for wedding invitation system.
Following fastapi-templates pattern.
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict


# ============ INVITACIÓN PÚBLICA ============

class InvitacionResponse(BaseModel):
    """Response for invitation page."""
    model_config = ConfigDict(from_attributes=True)

    nombre: str
    categoria: str
    acompanantes: str = ""  # JSON array of companion names
    confirmados: str = ""  # JSON array of confirmed attendee names
    confirmo: Optional[str] = None  # "si", "no", o None/empty
    # Coordinates for map
    coord_ceremonia: Optional[str] = None
    coord_recepcion: Optional[str] = None
    # Config
    nombres_novios: Optional[str] = None
    fecha_evento: Optional[str] = None
    hora_ceremonia: Optional[str] = None
    lugar_ceremonia: Optional[str] = None
    direccion_ceremonia: Optional[str] = None
    imagen_ceremonia: Optional[str] = None
    hora_recepcion: Optional[str] = None
    lugar_recepcion: Optional[str] = None
    direccion_recepcion: Optional[str] = None
    imagen_recepcion: Optional[str] = None
    fecha_limite_confirmacion: Optional[str] = None
    mensaje_bienvenida: Optional[str] = None
    hoteles: Optional[str] = None
    faqs: Optional[str] = None
    fecha_limite: Optional[str] = None  # per-guest deadline
    audio_url: Optional[str] = None


class RSVPRequest(BaseModel):
    """RSVP submission request."""
    codigo: str
    confirmo: str  # "si" or "no"
    cantidad: int = 1
    asistentes: str = "[]"  # JSON array of confirmed attendee names
    restricciones: Optional[str] = None  # dietary restrictions


class RSVPResponse(BaseModel):
    """RSVP submission response."""
    success: bool
    message: str
    nombre: str


# ============ ADMIN ============

class NuevoInvitado(BaseModel):
    """New guest creation request."""
    nombre: str
    categoria: str = "Amigos de la novia"
    acompanantes: str = ""  # JSON array of companion names
    prioridad: str = "Importante"
    fecha_limite: Optional[str] = None  # per-guest deadline


class InvitadoResponse(BaseModel):
    """Guest response."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    codigo: str
    nombre: str
    categoria: str
    acompanantes: str = ""  # JSON array of companion names
    confirmados: str = ""  # JSON array of confirmed attendee names
    prioridad: str
    confirmo: str
    cantidad: int
    fecha_confirmacion: Optional[str] = None
    fecha_limite: str = ""
    restricciones: Optional[str] = None  # dietary restrictions / notes


class ConfirmacionUpdate(BaseModel):
    """Admin update of confirmation status."""
    confirmo: str  # "si", "no", or "pendiente"
    cantidad: int = 0
    confirmados: str = ""  # JSON array of confirmed attendee names


class LoginRequest(BaseModel):
    """Admin login request."""
    password: str


class LoginResponse(BaseModel):
    """Admin login response."""
    token: str
    message: str


class StatsResponse(BaseModel):
    """Statistics response."""
    total: int
    confirmados: int
    rechazados: int
    pendientes: int
    tasa_confirmacion: float


# ============ CONFIGURACIÓN ============

class EventoConfig(BaseModel):
    """Configuración del evento."""
    nombres_novios: str = "Jonathan & Valentina"
    fecha_evento: str = "15 de Junio de 2025"
    hora_ceremonia: str = "4:00 PM"
    lugar_ceremonia: str = "Sede San Patricio"
    direccion_ceremonia: str = "Bogotá, Colombia"
    imagen_ceremonia: str = ""
    hora_recepcion: str = "6:00 PM"
    lugar_recepcion: str = "Sede San Patricio"
    direccion_recepcion: str = "Bogotá, Colombia"
    imagen_recepcion: str = ""
    fecha_limite_confirmacion: str = "1 de Mayo"
    mensaje_bienvenida: str = "Queridos amigos y familia, no hay nada que nos haga más ilusión que compartir el día más importante de nuestras vidas con las personas que nos han visto crecer y amarnos."
    hoteles: str = ""  # JSON string con array de hoteles
    faqs: str = ""
    audio_url: str = ""
