"""
Script para preparar el CSV de invitados con códigos únicos.
"""
import uuid
import unicodedata
import pandas as pd

def normalize_text(text: str) -> str:
    """Normaliza texto para generar códigos: minusculas sin acentos"""
    text = unicodedata.normalize('NFD', text)
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    text = text.lower().strip().replace(' ', '-')
    text = ''.join(c for c in text if c.isalnum() or c == '-')
    return text

def generate_code(nombre: str) -> str:
    """Genera código único para un invitado"""
    base = normalize_text(nombre.split()[0])  # Primer nombre
    short_id = str(uuid.uuid4())[:6]
    return f"{base}-{short_id}"

# Load original CSV
original_path = "../Invitados 1bed24b430a2814cbf11dee5d9ce15de_all.csv"
df = pd.read_csv(original_path)

# Add new columns
df['id'] = [str(uuid.uuid4()) for _ in range(len(df))]
df['codigo'] = [generate_code(n) for n in df['Nombre']]
df['nombre'] = df['Nombre']
df['categoria'] = df['Categoria']
df['es_pareja'] = df['Es pareja'].map({'Yes': True, 'No': False})
df['nombre_pareja'] = None
df['tiene_nino'] = df['Niño'].map({'Yes': True, 'No': False})
df['nombres_ninos'] = None
df['prioridad'] = df['Prioridad']
df['confirmo'] = df['Confirmo asistencia'].map({'Yes': 'si', 'No': 'no'}).fillna('pendiente')
df['cantidad'] = 0
df['fecha_confirmacion'] = None

# Keep only needed columns
df = df[['id', 'codigo', 'nombre', 'categoria', 'es_pareja', 'nombre_pareja', 
         'tiene_nino', 'nombres_ninos', 'prioridad', 'confirmo', 'cantidad', 'fecha_confirmacion']]

# Save new CSV
df.to_csv('../invitados.csv', index=False)
print(f"Created invitados.csv with {len(df)} guests")
print(df.head())