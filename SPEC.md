# SPEC.md — Wedding Invitation System

## 1. Project Overview

**Project**: Wedding Invitation System  
**Core Functionality**: Digital invitation platform that generates unique links for each guest, allows RSVP confirmation, and provides an admin dashboard for guest management.  
**Target Users**: Wedding couple (admin) and their guests (invitation recipients)

---

## 2. Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React +        │────▶│   FastAPI       │────▶│   CSV           │
│   Tailwind      │◀────│   Backend       │◀────│   Storage       │
│   (Frontend)    │     │   (Port 8000)   │     │   (Data)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Stack
- **Frontend**: React 18 + Vite + Tailwind CSS v4
- **Backend**: FastAPI (Python 3.11+)
- **Storage**: CSV file with unique invite codes

---

## 3. Data Schema

### CSV Structure (`invitados.csv`)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier |
| codigo | string | Unique URL code (e.g., `raul-vera`) |
| nombre | string | Guest full name |
| categoria | string | Category (Familia del Novio, Familia de la Novia, Amigos del novio, Amigos de la novia) |
| es_pareja | bool | Is +1 companion |
| nombre_pareja | string? | Companion name (optional) |
| tiene_nino | bool | Has children |
| nombres_ninos | string? | Children names (optional) |
| prioridad | string | Priority (Indispensable, Importante, Opcional) |
| confirmo | string | RSVP status (pendiente, si, no) |
| cantidad | int | Number of attendees |
| fecha_confirmacion | datetime? | When confirmed |

### Invite Code Generation
- Format: `{nombre-apellido}-{uuid-short}`
- Example: `raul-vera-a1b2c3`
- Normalization: lowercase, remove accents, spaces to hyphens

---

## 4. API Endpoints

### Public Endpoints
```
GET  /invitacion/{codigo}
```
- Returns invitation data for a specific guest
- Response: `{nombre, categoria, tiene_pareja, nombre_pareja, tiene_ninos, nombres_ninos}`

```
POST  /rsvp
```
- Submit RSVP confirmation
- Body: `{codigo: string, confirmo: "si"|"no", cantidad: int, acompanantes: string?}`

### Admin Endpoints (Protected)
```
GET  /admin/invitados
```
- Returns all guests
- Query params: `?categoria=&confirmo=&search=`

```
POST  /admin/invitados
```
- Add new guest
- Body: `{nombre, categoria, es_pareja, nombre_pareja, tiene_nino, nombres_ninos, prioridad}`

```
PUT  /admin/invitados/{id}
```
- Update guest

```
DELETE  /admin/invitados/{id}
```
- Remove guest

```
POST  /admin/login
```
- Admin authentication
- Body: `{password: string}`
- Returns: `{token: string}`

---

## 5. Frontend Pages

### Public Pages
1. **Invitation Page** (`/:codigo`)
   - Personalized greeting with guest name
   - Event details (date, time, venue)
   - RSVP form (confirm/count)
   - Design: "Ethereal Editorial" (from DESIGN.md)

### Admin Pages
2. **Login** (`/admin/login`)
   - Simple password protection

3. **Dashboard** (`/admin`)
   - Guest list table with filters
   - Stats (confirmed, pending, declined)
   - Add guest modal
   - Export CSV button

---

## 6. Security

### Admin Access
- Simple password-based auth (configurable via env)
- JWT token in cookies (httpOnly)
- Token expiry: 7 days

### Rate Limiting
- RSVP: 1 submission per code per hour

---

## 7. Acceptance Criteria

- [ ] Guest can access unique invitation URL
- [ ] Invitation displays personalized info (name, +1, children)
- [ ] Guest can confirm attendance with count
- [ ] CSV updates immediately after RSVP
- [ ] Admin can view all guests with filters
- [ ] Admin can add/edit/delete guests
- [ ] Dashboard shows RSVP statistics
- [ ] Responsive design works on mobile

---

## 8. Environment Variables

```env
# Backend
ADMIN_PASSWORD=your-secure-password
CSV_PATH=./invitados.csv
JWT_SECRET=your-jwt-secret-key

# Frontend
VITE_API_URL=http://localhost:8000
```