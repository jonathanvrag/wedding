"""
Wedding Invitation System - FastAPI Backend
"""
import os
import uuid
import unicodedata
from datetime import datetime
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
import pandas as pd
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import JWTError, jwt

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Wedding Invitation API",
    description="API para manage wedding invitations and RSVPs",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET", "default-secret")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "boda2025")

# CSV Path
CSV_PATH = os.getenv("CSV_PATH", "../invitados.csv")

# ============ MODELOS ============

class Invitado(BaseModel):
    id: str
    codigo: str
    nombre: str
    categoria: str
    es_pareja: bool = False
    nombre_pareja: Optional[str] = None
    tiene_nino: bool = False
    nombres_ninos: Optional[str] = None
    prioridad: str = "Importante"
    confirmo: str = "pendiente"
    cantidad: int = 0
    fecha_confirmacion: Optional[str] = None

class InvitacionResponse(BaseModel):
    nombre: str
    categoria: str
    tiene_pareja: bool
    nombre_pareja: Optional[str] = None
    tiene_ninos: bool
    nombres_ninos: Optional[str] = None

class RSVPRequest(BaseModel):
    codigo: str
    confirmo: str  # "si" or "no"
    cantidad: int = 1
    acompanantes: Optional[str] = None

class NuevoInvitado(BaseModel):
    nombre: str
    categoria: str = "Amigos de la novia"
    es_pareja: bool = False
    nombre_pareja: Optional[str] = None
    tiene_nino: bool = False
    nombres_ninos: Optional[str] = None
    prioridad: str = "Importante"

class LoginRequest(BaseModel):
    password: str

class LoginResponse(BaseModel):
    token: str
    message: str

# ============ HELPERS ============

def normalize_text(text: str) -> str:
    """Normaliza texto para generar códigos: minusculas sin acentos"""
    # Remove accents
    text = unicodedata.normalize('NFD', text)
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    # Lowercase and replace spaces with hyphens
    text = text.lower().strip().replace(' ', '-')
    # Remove special chars
    text = ''.join(c for c in text if c.isalnum() or c == '-')
    return text

def generate_code(nombre: str) -> str:
    """Genera código único para un invitado"""
    base = normalize_text(nombre.split()[0])  # Primer nombre
    short_id = str(uuid.uuid4())[:6]
    return f"{base}-{short_id}"

def load_csv() -> pd.DataFrame:
    """Carga el CSV de invitados"""
    path = Path(CSV_PATH)
    if not path.exists():
        # Create empty CSV with headers if doesn't exist
        df = pd.DataFrame(columns=[
            'id', 'codigo', 'nombre', 'categoria', 'es_pareja', 'nombre_pareja',
            'tiene_nino', 'nombres_ninos', 'prioridad', 'confirmo', 'cantidad', 'fecha_confirmacion'
        ])
        return df
    df = pd.read_csv(path)
    # Clean NaN explicitly
    df = df.replace({None: '', 'nan': '', 'NaN': '', 'None': ''})
    df = df.fillna('')
    return df

def get_value(row, col, default=None):
    """Get value from pandas row handling NaN"""
    val = row.iloc[0][col] if hasattr(row.iloc[0], '__getitem__') else row[col]
    if pd.isna(val) or val == '' or val is None:
        return default
    return str(val)

def save_csv(df: pd.DataFrame):
    """Guarda el CSV de invitados"""
    path = Path(CSV_PATH)
    df.to_csv(path, index=False)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Verifica el token JWT"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("sub", "")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )

# ============ ENDPOINTS PÚBLICOS ============

@app.get("/")
def root():
    return {"message": "Wedding Invitation API", "status": "online"}

@app.get("/invitacion/{codigo}", response_model=InvitacionResponse)
def get_invitacion(codigo: str):
    """Obtiene los datos de invitación para un código"""
    # Force fresh load every time
    df = pd.read_csv(CSV_PATH)
    df = df.fillna('')
    print(f"DEBUG: codigo={codigo}, nombre_pareja type={type(df[df['codigo'] == codigo].iloc[0]['nombre_pareja'])}")
    
    # Search by código
    row = df[df['codigo'] == codigo]
    
    if row.empty:
        raise HTTPException(status_code=404, detail="Invitación no encontrada")
    
    row = row.iloc[0]
    # Now all columns are strings, handle properly
    tiene_pareja = str(row['es_pareja']).lower() == 'true'
    tiene_ninos = str(row['tiene_nino']).lower() == 'true'
    
    nombre_pareja = row['nombre_pareja'] if row['nombre_pareja'] else None
    nombres_ninos = row['nombres_ninos'] if row['nombres_ninos'] else None
    
    return InvitacionResponse(
        nombre=row['nombre'],
        categoria=row['categoria'],
        tiene_pareja=tiene_pareja,
        nombre_pareja=nombre_pareja,
        tiene_ninos=tiene_ninos,
        nombres_ninos=nombres_ninos
    )

@app.post("/rsvp")
def submit_rsvp(request: RSVPRequest):
    """Confirma asistencia a la boda"""
    df = load_csv()
    
    # Find guest by code
    mask = df['codigo'] == request.codigo
    if not mask.any():
        raise HTTPException(status_code=404, detail="Invitado no encontrado")
    
    # Update confirmation
    df.loc[mask, 'confirmo'] = request.confirmo
    df.loc[mask, 'cantidad'] = request.cantidad
    
    # Handle companions
    if request.acompanantes:
        df.loc[mask, 'nombre_pareja'] = request.acompanantes
    
    # Set confirmation date
    df.loc[mask, 'fecha_confirmacion'] = datetime.now().isoformat()
    
    save_csv(df)
    
    return {
        "success": True,
        "message": f"Confirmación {'recibida' if request.confirmo == 'si' else 'rechazada'}",
        "nombre": df.loc[mask, 'nombre'].values[0]
    }

# ============ ENDPOINTS ADMIN ============

@app.post("/admin/login", response_model=LoginResponse)
def login(request: LoginRequest):
    """Autentica al administrador"""
    if request.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta"
        )
    
    # Generate JWT token
    token = jwt.encode(
        {"sub": "admin", "exp": datetime.now().timestamp() + 7*24*3600},
        JWT_SECRET,
        algorithm="HS256"
    )
    
    return LoginResponse(token=token, message="Login exitoso")

@app.get("/admin/invitados", dependencies=[Depends(verify_token)])
def get_invitados(
    categoria: Optional[str] = None,
    confirmo: Optional[str] = None,
    search: Optional[str] = None
):
    """Obtiene todos los invitados con filtros"""
    df = load_csv()
    
    # Apply filters
    if categoria:
        df = df[df['categoria'] == categoria]
    if confirmo:
        df = df[df['confirmo'] == confirmo]
    if search:
        df = df[df['nombre'].str.contains(search, case=False, na=False)]
    
    # Convert to list of dicts
    return df.to_dict(orient="records")

@app.post("/admin/invitados", dependencies=[Depends(verify_token)])
def add_invitado(invitado: NuevoInvitado):
    """Agrega un nuevo invitado"""
    df = load_csv()
    
    # Generate ID and code
    nuevo_id = str(uuid.uuid4())
    nuevo_codigo = generate_code(invitado.nombre)
    
    # Check if code already exists
    while df[df['codigo'] == nuevo_codigo].any().any():
        nuevo_codigo = generate_code(invitado.nombre)
    
    new_row = {
        'id': nuevo_id,
        'codigo': nuevo_codigo,
        'nombre': invitado.nombre,
        'categoria': invitado.categoria,
        'es_pareja': invitado.es_pareja,
        'nombre_pareja': invitado.nombre_pareja,
        'tiene_nino': invitado.tiene_nino,
        'nombres_ninos':invitado.nombres_ninos,
        'prioridad': invitado.prioridad,
        'confirmo': 'pendiente',
        'cantidad': 0,
        'fecha_confirmacion': None
    }
    
    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    save_csv(df)
    
    return {"success": True, "invitado": new_row}

@app.put("/admin/invitados/{invitado_id}", dependencies=[Depends(verify_token)])
def update_invitado(invitado_id: str, convidado: NuevoInvitado):
    """Actualiza un invitado"""
    df = load_csv()
    
    mask = df['id'] == invitado_id
    if not mask.any():
        raise HTTPException(status_code=404, detail="Invitado no encontrado")
    
    df.loc[mask, 'nombre'] = convidado.nombre
    df.loc[mask, 'categoria'] = convidado.categoria
    df.loc[mask, 'es_pareja'] = convidado.es_pareja
    df.loc[mask, 'nombre_pareja'] = convidado.nombre_pareja
    df.loc[mask, 'tiene_nino'] = convidado.tiene_nino
    df.loc[mask, 'nombres_ninos'] = convidado.nombres_ninos
    df.loc[mask, 'prioridad'] = convidado.prioridad
    
    save_csv(df)
    
    return {"success": True, "message": "Invitado actualizado"}

@app.delete("/admin/invitados/{invitado_id}", dependencies=[Depends(verify_token)])
def delete_invitado(invitado_id: str):
    """Elimina un invitado"""
    df = load_csv()
    
    mask = df['id'] == invitado_id
    if not mask.any():
        raise HTTPException(status_code=404, detail="Invitado no encontrado")
    
    df = df[df['id'] != invitado_id]
    save_csv(df)
    
    return {"success": True, "message": "Invitado eliminado"}

@app.get("/admin/stats", dependencies=[Depends(verify_token)])
def get_stats():
    """Obtiene estadísticas de confirmados"""
    df = load_csv()
    
    total = len(df)
    confirmados = len(df[df['confirmo'] == 'si'])
    rechazados = len(df[df['confirmo'] == 'no'])
    pendientes = len(df[df['confirmo'] == 'pendiente'])
    
    return {
        "total": total,
        "confirmados": confirmados,
        "rechazados": rechazados,
        "pendientes": pendientes,
        "tasa_confirmacion": round(confirmados / total * 100, 1) if total > 0 else 0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)