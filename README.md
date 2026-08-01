# Event Horizon GG

> Plataforma gaming enfocada en autenticación segura, identidad competitiva y arquitectura full stack escalable.

![Status](https://img.shields.io/badge/status-in%20development-cyan)
![Python](https://img.shields.io/badge/Python-3.12-yellow)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

---

## Tech Stack

- Frontend → Next.js, React, TypeScript, Tailwind CSS
- Backend  → FastAPI, Python, SQLAlchemy 2.0
- Base de datos → PostgreSQL 16
- Caché → Redis 7
- Autenticación → JWT, bcrypt, TOTP 2FA
- Infraestructura → Docker, Docker Compose

---

## Funcionalidades Implementadas

- **Registro** — email, gamertag, password con validación service-side
- **Login** — JWT access token (15min) + refresh token rotation
- **2FA** — TOTP via Google Authenticator, generación de código Qr
- **Session management** — HttpOnly cookies, tokens en memoria (nunca en localStorage)
- **Protección de rutas** — redirección automática si la sesión expira
- **Dashboard** — authenticated user data display

## Seguridad

El sistema de autenticación fue auditado contra el OWASP API Security Top 10:

- **Autenticación en dos pasos (2FA)** con TOTP, mediante código QR compatible 
  con apps como Google Authenticator.
- **JWT con rotación de refresh tokens**: cada renovación invalida el token 
  anterior, y el refresh token se almacena hasheado en base de datos (nunca 
  en texto plano).
- **Refresh token en cookie HttpOnly**, en vez de exponerlo en el cuerpo de 
  la respuesta, reduciendo el riesgo de robo vía XSS.
- **Access tokens de vida corta** (15 min) para minimizar la ventana de 
  riesgo ante un token comprometido.
- **Rate limiting** en los endpoints más sensibles (login, registro, 
  verificación de OTP y confirmación de 2FA), usando Redis con estrategia 
  de ventana deslizante para evitar ataques de fuerza bruta.
- **Mensajes de error sin filtrado de información sensible**: las validaciones 
  de credenciales no revelan si el fallo fue por email o contraseña incorrectos.
- **Validación de contraseñas** con reglas de longitud, mayúsculas y números.
- **Distinción de tipos de token** (access, refresh, otp_pending) para evitar 
  que un token se use fuera del contexto para el que fue emitido.
  
### Gestión de autenticación
- Access Token gestionado desde React mediante contexto de autenticación
- Refresh Token almacenado de forma segura en HttpOnly Cookies
- Protección automática de rutas privadas
- Renovación de sesión mediante refresh token

---

## Instalación local

### Requisitos
- Python 3.12+
- Node.js 22+
- Docker Desktop

### 1. Clonar repo
```bash
git clone https://github.com/marialis19/event-horizon-gg.git
cd event-horizon-gg
```

### 2. Levantar infraestructura
```bash
docker compose up -d
```

### 3. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate.bat   # Windows
pip install -r requirements.txt
```

Create `.env` from `.env.example`:
```bash
copy .env.example .env
```

Inicializar BD y ejecutar servidor:
```bash
python init_db.py
uvicorn app.main:app --reload
```

API available at: `http://localhost:8000`  
Swagger docs: `http://localhost:8000/docs`

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

App available at: `http://localhost:3000`

---

## Roadmap

- [x] Auth service — register, login, logout, 2FA
- [x] JWT + refresh token rotation
- [x] Frontend login/register con validación
- [x] AuthContext — secure token management
- [x] Dashboard protegido
- [ ] OTP screen — 2FA login flow
- [ ] Tournament engine
- [ ] ELO ranking system
- [ ] Real-time match brackets
- [ ] WebSocket integration

---

## Autora

**Marialis Aquino** — [@marialis19](https://github.com/marialis19)

---

*Play Beyond Limits.*