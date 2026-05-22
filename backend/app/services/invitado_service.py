"""
Business logic for guest management.
Following fastapi-templates service layer pattern.
"""
import uuid
import unicodedata
from typing import List, Optional

import pandas as pd
from pandas import DataFrame

from app.core.config import get_settings
from app.schemas.invitado import (
    NuevoInvitado, 
    InvitadoResponse,
    InvitacionResponse
)

settings = get_settings()


class InvitadoService:
    """Service for guest CRUD operations."""
    
    def _load_csv(self) -> DataFrame:
        """Load and clean CSV data."""
        df = pd.read_csv(settings.CSV_PATH)
        # Clean NaN values
        df = df.fillna('')
        return df
    
    def _save_csv(self, df: DataFrame):
        """Save CSV data."""
        df.to_csv(settings.CSV_PATH, index=False)
    
    def _normalize_text(self, text: str) -> str:
        """Normalize text for code generation."""
        # Remove accents
        text = unicodedata.normalize('NFD', text)
        text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
        # Lowercase and replace spaces
        text = text.lower().strip().replace(' ', '-')
        return ''.join(c for c in text if c.isalnum() or c == '-')
    
    def _generate_code(self, nombre: str) -> str:
        """Generate unique invite code."""
        base = self._normalize_text(nombre.split()[0])
        short_id = str(uuid.uuid4())[:6]
        return f"{base}-{short_id}"
    
    def get_by_code(self, codigo: str) -> Optional[InvitacionResponse]:
        """Get invitation data by code."""
        df = self._load_csv()
        config = self.get_config()
        
        row = df[df['codigo'] == codigo]
        
        if row.empty:
            return None
        
        row = row.iloc[0]
        
        confirmo = row.get('confirmo', '')
        acompanantes = str(row.get('acompanantes', '')) or ''
        if acompanantes in ('nan', 'None', '') or not acompanantes.strip():
            acompanantes = ''
        confirmados = str(row.get('confirmados', '')) or ''
        if confirmados in ('nan', 'None', '') or not confirmados.strip():
            confirmados = ''
        
        return InvitacionResponse(
            nombre=row['nombre'],
            categoria=row['categoria'],
            acompanantes=acompanantes,
            confirmados=confirmados,
            confirmo=confirmo if confirmo else None,
            # Include config
            nombres_novios=config.get('nombres_novios'),
            fecha_evento=config.get('fecha_evento'),
            hora_ceremonia=config.get('hora_ceremonia'),
            lugar_ceremonia=config.get('lugar_ceremonia'),
            direccion_ceremonia=config.get('direccion_ceremonia'),
            coord_ceremonia=config.get('coord_ceremonia'),
            coord_recepcion=config.get('coord_recepcion'),
            imagen_ceremonia=config.get('imagen_ceremonia'),
            hora_recepcion=config.get('hora_recepcion'),
            lugar_recepcion=config.get('lugar_recepcion'),
            direccion_recepcion=config.get('direccion_recepcion'),
            imagen_recepcion=config.get('imagen_recepcion'),
            fecha_limite_confirmacion=config.get('fecha_limite_confirmacion'),
            mensaje_bienvenida=config.get('mensaje_bienvenida'),
            hoteles=config.get('hoteles'),
            faqs=config.get('faqs'),
            audio_url=config.get('audio_url')
        )
    
    def submit_rsvp(
        self, 
        codigo: str, 
        confirmo: str, 
        cantidad: int,
        asistentes: str = "[]",
        restricciones: Optional[str] = None
    ) -> dict:
        """Submit RSVP confirmation."""
        df = self._load_csv()
        mask = df['codigo'] == codigo
        
        if not mask.any():
            raise ValueError("Invitado no encontrado")
        
        # Update values
        df.loc[mask, 'confirmo'] = confirmo
        df.loc[mask, 'cantidad'] = cantidad
        df.loc[mask, 'confirmados'] = asistentes
        if restricciones:
            df.loc[mask, 'restricciones'] = restricciones
        df.loc[mask, 'fecha_confirmacion'] = pd.Timestamp.now().isoformat()
        
        self._save_csv(df)
        
        return {
            "success": True,
            "message": f"Confirmación {'recibida' if confirmo == 'si' else 'rechazada'}",
            "nombre": df.loc[mask, 'nombre'].values[0]
        }
    
    def get_all(
        self, 
        categoria: Optional[str] = None,
        confirmo: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[InvitadoResponse]:
        """Get all guests with filters."""
        df = self._load_csv()
        
        # Apply filters
        if categoria:
            df = df[df['categoria'] == categoria]
        if confirmo:
            df = df[df['confirmo'] == confirmo]
        if search:
            df = df[df['nombre'].str.contains(search, case=False, na=False)]
        
        # Convert to response models
        return [
            InvitadoResponse(
                id=row['id'],
                codigo=row['codigo'],
                nombre=row['nombre'],
                categoria=row['categoria'],
                acompanantes=str(row.get('acompanantes', '')) if str(row.get('acompanantes', '')) not in ('nan', 'None', '') else '',
                confirmados=str(row.get('confirmados', '')) if str(row.get('confirmados', '')) not in ('nan', 'None', '') else '',
                prioridad=row['prioridad'],
                confirmo=row['confirmo'],
                cantidad=row['cantidad'],
                fecha_confirmacion=row['fecha_confirmacion'] or None
            )
            for _, row in df.iterrows()
        ]
    
    def create(self, nuevo: NuevoInvitado) -> InvitadoResponse:
        """Create new guest."""
        df = self._load_csv()
        
        # Generate unique ID and code
        nuevo_id = str(uuid.uuid4())
        nuevo_codigo = self._generate_code(nuevo.nombre)
        
        # Ensure unique code
        while df[df['codigo'] == nuevo_codigo].any().any():
            nuevo_codigo = self._generate_code(nuevo.nombre)
        
        new_row = {
            'id': nuevo_id,
            'codigo': nuevo_codigo,
            'nombre': nuevo.nombre,
            'categoria': nuevo.categoria,
            'acompanantes': nuevo.acompanantes,
            'prioridad': nuevo.prioridad,
            'confirmo': 'pendiente',
            'cantidad': 0,
            'fecha_confirmacion': None
        }
        
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        self._save_csv(df)
        
        return InvitadoResponse(**new_row)
    
    def update(self, guest_id: str, updates: NuevoInvitado) -> InvitadoResponse:
        """Update guest."""
        df = self._load_csv()
        mask = df['id'] == guest_id
        
        if not mask.any():
            raise ValueError("Invitado no encontrado")
        
        df.loc[mask, 'nombre'] = updates.nombre
        df.loc[mask, 'categoria'] = updates.categoria
        df.loc[mask, 'acompanantes'] = updates.acompanantes
        df.loc[mask, 'prioridad'] = updates.prioridad
        
        self._save_csv(df)
        
        row = df[mask].iloc[0]
        return InvitadoResponse(
            id=row['id'],
            codigo=row['codigo'],
            nombre=row['nombre'],
            categoria=row['categoria'],
                            acompanantes=str(row.get('acompanantes', '')) if str(row.get('acompanantes', '')) not in ('nan', 'None', '') else '',
                confirmados=str(row.get('confirmados', '')) if str(row.get('confirmados', '')) not in ('nan', 'None', '') else '',
            prioridad=row['prioridad'],
            confirmo=row['confirmo'],
            cantidad=row['cantidad'],
            fecha_confirmacion=row['fecha_confirmacion'] or None
        )
    
    def delete(self, guest_id: str) -> bool:
        """Delete guest."""
        df = self._load_csv()
        mask = df['id'] == guest_id
        
        if not mask.any():
            raise ValueError("Invitado no encontrado")
        
        df = df[df['id'] != guest_id]
        self._save_csv(df)
        
        return True
    
    def _count_people(self, row) -> int:
        """Count total people (main guest + companions) for a row."""
        import json
        count = 1
        try:
            comps = json.loads(row.get('acompanantes', '[]'))
            if isinstance(comps, list):
                count += len([c for c in comps if c])
        except (json.JSONDecodeError, TypeError):
            pass
        return count

    def get_stats(self) -> dict:
        """Get RSVP statistics counting actual people (not just groups)."""
        df = self._load_csv()

        people_total = sum(self._count_people(row) for _, row in df.iterrows())
        people_confirmados = sum(self._count_people(row) for _, row in df[df['confirmo'] == 'si'].iterrows())
        people_rechazados = sum(self._count_people(row) for _, row in df[df['confirmo'] == 'no'].iterrows())
        people_pendientes = sum(self._count_people(row) for _, row in df[df['confirmo'] == 'pendiente'].iterrows())

        return {
            "total": people_total,
            "confirmados": people_confirmados,
            "rechazados": people_rechazados,
            "pendientes": people_pendientes,
            "tasa_confirmacion": round(people_confirmados / people_total * 100, 1) if people_total > 0 else 0
        }
    
    def get_config(self) -> dict:
        """Get evento configuration."""
        import json
        from pathlib import Path
        
        config_path = Path(settings.CSV_PATH).parent / "config.json"
        if config_path.exists():
            with open(config_path) as f:
                return json.load(f)
        
        # Default config
        return {
            "nombres_novios": "Jonathan & Valentina",
            "fecha_evento": "15 de Junio de 2025",
            "hora_ceremonia": "4:00 PM",
            "lugar_ceremonia": "Sede San Patricio",
            "direccion_ceremonia": "Bogotá, Colombia",
            "imagen_ceremonia": "",
            "hora_recepcion": "6:00 PM",
            "lugar_recepcion": "Sede San Patricio",
            "direccion_recepcion": "Bogotá, Colombia",
            "imagen_recepcion": "",
            "fecha_limite_confirmacion": "2025-05-01",
            "mensaje_bienvenida": "Queridos amigos y familia, no hay nada que nos haga más ilusión que compartir el día más importante de nuestras vidas con las personas que nos han visto crecer y amarnos. Queremos que esta celebración sea un reflejo de nuestra gratitud por vuestro cariño incondicional. Os esperamos paraivar por el amor, la risa y el futuro.",
            "hoteles": json.dumps([
                {"name": "Hotel El Mirador", "dist": "A 5 min del lugar", "desc": "Un espacio boutique con vistas increíble.", "imagen": "", "url": ""},
                {"name": "Villa Serena", "dist": "A 10 min del lugar", "desc": "Encanto rústico y jardines privados.", "imagen": "", "url": ""},
                {"name": "Grand Plaza Suites", "dist": "A 15 min del lugar", "desc": "Opción moderna en el centro histórico.", "imagen": "", "url": ""}
            ]),
            "faqs": json.dumps([
                {"q": "¿Cuál es el código de vestimenta?", "a": "El Dress Code para nuestra boda es formal. Para los hombres, recomendamos traje; para las mujeres, vestido largo o de córtel."},
                {"q": "¿Podemos ir con niños?", "a": "Aunque nos encantan los niños, hemos decidido celebrar una boda solo para adultos para que todos podáis disfrutar de la noche sin preocupaciones."},
                {"q": "¿Habrá servicio de transporte?", "a": "Sí, pondremos a vuestra disposición un servicio de autobuses que saldrá desde el centro de la ciudad."}
            ]),
            "audio_url": ""
        }
    
    def save_config(self, config: dict) -> dict:
        """Save evento configuration."""
        import json
        from pathlib import Path
        
        config_path = Path(settings.CSV_PATH).parent / "config.json"
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
        
        return config


# Singleton instance
invitado_service = InvitadoService()