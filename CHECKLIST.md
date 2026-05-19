# Wedding Invitation System - Skill Checklist

## Skills Disponibles
| Skill | Para qué | Aplicada? |
|-------|---------|-----------|
| fastapi-templates | Estructura FastAPI, DI, patrones async | ❌ |
| tailwind-design-system | Design tokens, CSS-first, componentes | ⚠️ Parcial |
| frontend-design | UI premium, animations, tipografía | ⚠️ Parcial |
| interface-design | Dashboards, admin panels, surfaces | ❌ |
| vercel-react-best-practices | React optimizado | ❌ |

---

## CHECKLIST: FastAPI (fastapi-templates)

### Antes de escribir código:
- [ ] Usar estructura de proyecto recomendada (app/api, app/core, app/services)
- [ ] Configurar lifespan para startup/shutdown
- [ ] Usar dependency injection de FastAPI
- [ ] Configurar Settings con pydantic-settings
- [ ] Implementar JWT con passlib/bcrypt
- [ ] Usar patrones async

### Estructura actual vs recomendada:
```
Backend actual:
├── main.py (todo junto - VIOLA PATRÓN)
├── requirements.txt
├── .env
└── prepare_csv.py

Backend recomendado:
├── app/
│   ├── api/v1/endpoints/    ← Falta
│   ├── core/
│   │   ├── config.py       ← Falta
│   │   ├── security.py    ← Falta
│   │   └── database.py   ← CSV no es DB
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── main.py
```

### Verificación actual:
- [ ] ❌ No hay estructura modular
- [ ] ❌ No hay dependency injection
- [ ] ❌ No hay settings con pydantic-settings
- [ ] ⚠️ JWT existe pero no usa passlib/bcrypt
- [ ] ⚠️ CSV funciona pero no es pattern recomendado

---

## CHECKLIST: Tailwind (tailwind-design-system)

### Antes de escribir CSS:
- [ ] Usar @theme para design tokens
- [ ] Implementar colores semánticos
- [ ] Definir radius tokens
- [ ] Crear animaciones en @theme
- [ ] Usar dark mode variant

### Verificación actual (tailwind.config.js):
```javascript
// LO QUE HICE:
colors: {
  primary: '#5b6143',
  surface: '#faf9f6',
  // ...
}

// LO QUE DEBERÍA HACER (según skill):
@theme {
  --color-primary: oklch(14.5% 0.025 264);
  --color-surface: oklch(100% 0 0);
  // ...
}
```

### Verificación CSS:
- [ ] ❌ No usa @theme
- [ ] ❌ No usa oklch()
- [ ] ❌ No hay dark mode variant
- [ ] ❌ Componentes no siguen CVA pattern

---

## CHECKLIST: Frontend Design (frontend-design)

### Principios:
- [ ] Tipografía distintiva (no generic)
- [ ] Color con propósito (no random)
- [ ] Animaciones orchestration
- [ ] Composición espacial (no generic grid)
- [ ] Backgrounds con profundidad

### Lo que hice vs lo que debería:
```
Lo que hice:
- Noto Serif + Manrope ✓ (bien)
- Colores del DESIGN.md ✓ (bien)
- Framer Motion ⚠️ (funcional pero no orquestado)
- Layout centralizado ⚠️ (genérico)

Lo que debería:
- Staggered reveals con animation-delay
- Botanical decorations SVG
- Asimetría intentional
- Texturas/overlays
```

### Verificación:
- [ ] ⚠️ Tipografía bien
- [ ] ⚠️ Colores bien
- [ ] ❌ Sin botanical SVG
- [ ] ❌ Sin staggered orchestration
- [ ] ❌ Sin texturas

---

## CHECKLIST: Interface Design (interface-design)

### Dashboard admin:
- [ ] Surface elevation system
- [ ] Border progression
- [ ] Text hierarchy (4 niveles)
- [ ] Spacing scale
- [ ] Navigation context

### Lo que hice vs lo que debería:
```
Lo que hice:
- Tabla simple con bg-surface-container-lowest
- Divisors con border genéricos
- Colores hardcodeados

Lo que debería:
- Niveles: base, hover, active, selected
- Border: subtle/medium/emphasis
- Semantic: success/warning/error
- Token names intencionales
```

### Verificación:
- [ ] ❌ No hay surface elevation
- [ ] ❌ No hay border progression
- [ ] ❌ No hay spacing scale
- [ ] ❌ No hay token architecture

---

## ACCIÓN: Refinamiento Necesario

### Priority 1 - Crítico:
1. [x] Backend: Separar en estructura modular (app/)
2. [x] Backend: Agregar config con pydantic-settings

### Priority 2 - Importante:
3. [x] Tailwind: Migrar a @theme con oklch
4. [x] CSS: Agregar dark mode variant

### Priority 3 - Nice to have:
5. [x] Frontend: Agregar botanical SVG
6. [x] Frontend: Staggered animations
7. [x] Admin: Surface elevation system

---

## ✅ VERIFICACIÓN FINAL

### fastapi-templates:
- [x] Estructura modular (app/api, app/core, app/schemas, app/services)
- [x] Config con pydantic-settings
- [x] Security con passlib/bcrypt
- [x] Dependency injection
- [x] Lifespan events

### tailwind-design-system:
- [x] @theme para tokens
- [x] Dark mode variant
- [x] Componentes (btn-primary, btn-secondary, card, input)
- [x] Animaciones en @theme

### frontend-design:
- [x] Tipografía distintiva (Noto Serif + Manrope)
- [x] Botanical SVG decorations
- [x] Staggered animations con framer-motion
- [x] Composición espacial

### interface-design:
- [x] Surface elevation (card levels)
- [x] Semantic badges (success/warning/error)
- [x] Spacing scale
- [x] Filter components

---

## 📋 CÓMO USAR ESTE CHECKLIST EN FUTURAS SESIONES:

1. Antes de cada task → Cargar skill relevante
2. Leer requisitos de la skill
3. Escribir código cumpliendo requisitos
4. Verificar contra checklist
5. Iterar hasta que todo tenga ✓

**Skills usadas en este refinamiento:**
- fastapi-templates ✅
- tailwind-design-system ✅
- frontend-design ✅
- interface-design ✅