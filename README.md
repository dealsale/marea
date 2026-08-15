# Marea Tours 🌊

Landing page bilingüe (ES/EN) + sistema de reservas + panel de administración para **Marea Tours**, tours culturales por la Comuna 13 de Medellín.

> +5 años de experiencia · Guías locales bilingües · Algunos tours son gratis (a la gorra)

## ✨ Características

- **Landing animada** (Framer Motion): hero, tours, nosotros, opiniones, FAQ.
- **Bilingüe ES / EN** con selector de idioma (se recuerda la preferencia).
- **Aterrizaje en WhatsApp**: botón flotante + CTAs, y toda reserva genera un mensaje
  de WhatsApp prellenado con los datos del tour.
- **Sistema de booking** conectado a base de datos: el cliente elige tour, fecha,
  hora, personas e idioma y la reserva queda registrada.
- **Panel de administración** (`/admin`): métricas, gestión de reservas
  (confirmar / cancelar / eliminar, contacto directo por WhatsApp) y gestión de
  tours (crear, editar precio/idioma/cupos, destacar, ocultar).
- **Tours gratis**: se muestran con etiqueta *GRATIS / FREE* y se reservan sin costo.

## 🛠️ Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Prisma + PostgreSQL · Zod

> 🚂 **¿Desplegar en vivo?** Sigue [`DEPLOY.md`](./DEPLOY.md) para publicar en Railway con base de datos y panel de admin.

## 🚀 Puesta en marcha

```bash
npm install            # instala y genera el cliente de Prisma
# Configura DATABASE_URL (PostgreSQL) en .env — ver .env.example
npx prisma migrate deploy   # crea las tablas
npm run db:seed             # carga los tours de ejemplo
npm run dev                 # http://localhost:3000
```

> Necesitas una base PostgreSQL. Para desarrollo local puedes usar la de Railway
> (copia su `DATABASE_URL`) o un Postgres local.

Producción:

```bash
npm run build   # prisma generate + migrate deploy + next build
npm start
```

## 🔧 Configuración (`.env`)

Copia `.env.example` a `.env` y ajusta:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL (Railway la inyecta automáticamente). |
| `ADMIN_PASSWORD` | Contraseña del panel `/admin`. |
| `SESSION_SECRET` | Secreto para firmar la sesión de admin (cámbialo en producción). |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp con código de país, solo dígitos (ej. `573001234567`). |

### Acceso al panel

Ir a `/admin` e ingresar con `ADMIN_PASSWORD` (por defecto `marea2020` — **cámbiala**).

## 📁 Estructura

```
app/                 Páginas y API (Next App Router)
  api/bookings       Crear reservas (público)
  api/admin/*        Login, reservas y tours (protegido)
  admin/             Panel de administración
components/          UI de la landing y del admin
lib/                 Prisma, auth, i18n, formato
prisma/              Esquema, migraciones y seed
```

## 🌐 Despliegue

Funciona en cualquier host de Next.js. SQLite es ideal para empezar; para producción
en plataformas serverless (Vercel, etc.) cambia el `datasource` de Prisma a Postgres
y actualiza `DATABASE_URL`.

---

Los tours de ejemplo, opiniones e imágenes ilustrativas son de muestra: edítalos desde
el panel de administración o en `prisma/seed.ts`. Reemplaza el número de WhatsApp por el real.
