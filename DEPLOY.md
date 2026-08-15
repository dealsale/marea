# Desplegar Marea Tours en Railway 🚂

Guía paso a paso para poner el sitio en vivo con base de datos y panel de admin.

## 1. Crea el proyecto

1. Entra a [railway.app](https://railway.app) e inicia sesión con GitHub.
2. **New Project → Deploy from GitHub repo** y elige `dealsale/app`.
3. En **Settings → Source**, selecciona la rama `claude/a-mar-tour-booking-page-bu1th9`
   (o `main` si ya la fusionaste).

## 2. Agrega la base de datos PostgreSQL

1. Dentro del proyecto: **New → Database → Add PostgreSQL**.
2. Railway crea la base y expone la variable `DATABASE_URL` automáticamente.
3. Ve al servicio de la **app** → pestaña **Variables** → **New Variable Reference**
   y enlaza `DATABASE_URL` desde el Postgres (o usa `${{Postgres.DATABASE_URL}}`).

## 3. Configura las variables de entorno

En el servicio de la app, pestaña **Variables**, agrega:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | (referencia al Postgres, ver paso 2) |
| `ADMIN_USERNAME` | tu usuario para entrar a `/admin` (ej. `marea`) |
| `ADMIN_PASSWORD` | la contraseña que quieras para `/admin` |
| `SESSION_SECRET` | una cadena larga y aleatoria |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | tu WhatsApp con indicativo, solo dígitos (ej. `573001234567`) |

> Genera un `SESSION_SECRET` rápido con: `openssl rand -hex 32`

## 4. Deploy

- Railway construye con `npm run build` y arranca con `npm run start`.
- El arranque ejecuta automáticamente **`prisma migrate deploy`** (crea las tablas)
  y **siembra los 6 tours** de ejemplo (idempotente).
- Cuando termine, en **Settings → Networking → Generate Domain** obtienes tu URL pública.

## 5. Listo ✅

- Sitio público: la URL que generó Railway.
- Panel de admin: `TU-URL/admin` (entra con `ADMIN_PASSWORD`).

---

## 6. Conecta tu dominio: `mareatours.site`

1. En el servicio de la app: **Settings → Networking → Custom Domain**.
2. Agrega **`mareatours.site`** y también **`www.mareatours.site`**.
3. Railway te mostrará a qué apuntar. En tu proveedor del dominio (donde compraste
   `mareatours.site`), crea estos registros DNS:

   | Tipo | Nombre / Host | Valor / Destino |
   |---|---|---|
   | `CNAME` | `www` | el destino que te da Railway (algo como `xxxx.up.railway.app`) |
   | `CNAME` o `ALIAS`/`ANAME` | `@` (raíz) | el mismo destino de Railway |

   > Muchos proveedores no permiten `CNAME` en la raíz (`@`). Si es tu caso, usa
   > un registro **ALIAS/ANAME** apuntando a Railway, **o** configura el dominio raíz
   > para que **redirija a `www.mareatours.site`**. Cloudflare, Namecheap y GoDaddy
   > lo soportan de formas ligeramente distintas — si me dices dónde compraste el
   > dominio, te doy los valores exactos.

4. Espera a que propague el DNS (unos minutos a un par de horas). Railway emite el
   **certificado HTTPS** automáticamente. ¡Listo: tu sitio en `https://mareatours.site`!

---

### Notas

- El seed usa `upsert`, así que puedes reiniciar sin duplicar tours. Edita todo desde
  el panel de admin o en `prisma/seed.mjs`.
- ¿Prefieres otra plataforma? Cualquier host de Node/Next.js con Postgres sirve
  (Render, Fly.io, VPS). Solo necesita las mismas 4 variables de entorno.
