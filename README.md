# 🎪 Mapa Interactivo para Eventos & Ferias en Canchas

Aplicación web móvil (PWA) diseñada para ferias, kermesses vecinales, eventos costumbristas o festivales en canchas y recintos abiertos.

**🌐 En vivo en GitHub Pages:** https://contactoandeslink-gif.github.io/mapa-festival-villa/

## 🚀 ¿Cómo probarlo?

### En tu celular (producción)
Abre https://contactoandeslink-gif.github.io/mapa-festival-villa/ — funciona como PWA instalable y con caché offline (gracias a `sw.js`).

### En tu PC (desarrollo)
1. Clona el repo y ejecuta `iniciar_servidor.bat` (o `python -m http.server 8000`).
2. Abre http://localhost:8000 — desde tu celular en la misma Wi-Fi: `http://192.168.1.X:8000`.

## 📁 Archivos

| Archivo | Rol |
|---------|-----|
| `index.html` | App del asistente: mapa Leaflet, GPS, fichas de locales, escenario en vivo |
| `admin.html` | Panel del organizador: precios, stock, horarios, carteles QR (⚠️ sin contraseña, solo afecta el navegador local) |
| `sw.js` | Service Worker: caché offline del app shell, teselas del mapa y media |
| `manifest.webmanifest` + `icon.svg` | PWA instalable |

## 🗺️ Editor Visual del Recinto (cada feria es distinta)

En `admin.html`, pestaña **🗺️ Diseño del Recinto**:

| Herramienta | Qué hace |
|-------------|----------|
| 👆 Mover Puestos | Arrastra cualquier puesto con mouse o dedo; se guarda y publica solo |
| ➕ Agregar Puesto | Clic en el mapa → se abre la ficha con la ubicación ya puesta |
| 🛤️ Dibujar Pasillo | Clics para marcar puntos → ✅ Finalizar → nombre. Aparece en la app del asistente y las rutas “¿Cómo llegar?” lo siguen |
| 🧩 Dibujar Sector | Dos clics en esquinas opuestas → nombre y color. Zona sombreada con banner en el mapa del asistente + entrada en la leyenda |
| 🗑️ Eliminar | Clic sobre puesto, pasillo o sector → confirmar → fuera |

El diseño (`festival_layout`: sectores + pasillos) se guarda en localStorage, se propaga por BroadcastChannel y se sube a Supabase como fila `layout` (los teléfonos lo reciben en el siguiente poll de 25 s). El asistente ve: sectores sombreados con banners, pasillos punteados con rótulo, leyenda 🗺️ colapsable, aviso “📍 ¡Usted está aquí!” al primer GPS y rutas peatronales que siguen los pasillos.

## 🎨 Facelift visual + GPS inteligente (2026-11-13)

- **Tema claro diurno por defecto** (fondo #F1F5F9, legible bajo el sol) con botón ☀️/🌙 que alterna al modo nocturno y persiste la preferencia.
- **Puestos como rectángulos proporcionales** tipo plano de feria profesional (pines circulares solo para Baños/Escenario/Entrada).
- **Navegación única** (barra inferior); header compacto.
- **Nombres de pasillo** aparecen al acercar el zoom (como calles en Google Maps); banners y rótulos con `pointer-events: none` (nunca roban el toque).
- **Búsqueda con vitrina de precios:** al buscar un producto, su precio aparece flotando sobre el pin del puesto y los no coincidentes se atenúan (nunca desaparecen).
- **Estado del puesto en vivo** (🟢 OK / ⏳ Fila / 🔴 Agotado): el admin lo cambia con un toque y el rectángulo se apaga/etiqueta en todos los teléfonos en el próximo sync.
- **GPS anti-saltos** (suavizado exponencial + rechazo de teletransportes), **snap a pasillos** (<8m se pega al centro del pasillo, como el auto de Google Maps), rumbo por curso GPS al caminar, y **distancia real caminando** (suma de tramos de la ruta, no línea recta).
- **Editor:** snap-to-grid al soltar un puesto cerca de un pasillo (cuadrícula ~3.3m) con **auto-numeración** (“Pasillo Central #4”).

## ⚙️ Configuración importante

- **Fecha del evento:** en `index.html`, constante `EVENT_DATE` (formato `'YYYY-MM-DD'`). Con `null` la app asume que el festival es hoy (modo demo). Con fecha definida, fuera de ese día muestra "📅 Próxima edición" en vez de fingir un show en vivo.
- **Coordenadas de la cancha:** constante `DEFAULT_CENTER` en `index.html` y `admin.html`.
- **Versión de datos:** `DATA_VERSION` (en `index.html` y `admin.html`, deben coincidir). Súbela cuando cambies los datos por defecto para limpiar cachés viejas de los visitantes.

## 🧭 Funcionalidades

1. **📍 Punto Azul GPS con Pulso:** geolocalización en vivo; si el GPS falla o estás fuera del recinto, avisa en vez de mostrar distancias absurdas.
2. **🛰️ Mapa vectorial del recinto:** cancha, escenario, pasillos y puestos dibujados con Leaflet (funcionan incluso sin teselas si hay mala señal).
3. **🍔 Puestos con fichas completas:** foto, carta con precios, WhatsApp, datos de transferencia, tiempo de preparación y "¿Cómo llegar?" con distancia en vivo.
4. **🎸 Escenario en vivo:** motor de horarios con hora de Chile, pausas técnicas, retrasos y estados (próximo / en vivo / finalizado).
5. **📷 QR por puesto:** carteles imprimibles desde el admin (`?stand=P-01` ubica al visitante frente al puesto).
6. **📴 Offline:** el service worker guarda el app y las teselas visitadas; la app abre sin conexión.

## ⚠️ Notas de seguridad

- El panel `admin.html` **no tiene autenticación**: sus cambios se guardan en localStorage y se suben a Supabase si lo configuraste (botón ☁️ Nube).
- No publiques datos bancarios o personales reales en el código: el repo es público.

### 🚨 Importante: política RLS de escritura pública en Supabase

El script SQL del panel crea la política `"Escritura pública del festival" ... for all using (true) with check (true)`. Esto significa que **cualquier persona en internet que conozca la Project URL y la anon key** (ambas visibles en el código de la app) puede **sobreescribir o borrar** la configuración del festival: precios, stock, shows y —lo más grave— **las cuentas bancarias de los puestos** (podrían redirigir transferencias).

**Mitigación recomendada (Edge Function con secreto de admin):**

1. Bloquea la escritura directa (SQL Editor):
   ```sql
   drop policy if exists "Escritura pública del festival" on festival_config;
   -- La lectura pública (select) se mantiene: los asistentes solo leen.
   ```
2. Crea la función `supabase/functions/festival-sync/index.ts`:
   ```ts
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
   Deno.serve(async (req) => {
     if (req.headers.get('x-admin-secret') !== Deno.env.get('ADMIN_SECRET'))
       return new Response('No autorizado', { status: 401 });
     const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
     const { error } = await supabase.from('festival_config').upsert(await req.json());
     return new Response(error ? JSON.stringify(error) : 'ok', { status: error ? 400 : 200 });
   });
   ```
3. Deploy: `supabase functions deploy festival-sync` y setea el secreto `ADMIN_SECRET` en los settings de la función.
4. En `admin.html`, cambia el endpoint de `syncToSupabaseSilent`/`testAndSyncCloud` a `${cleanUrl}/functions/v1/festival-sync` y agrega el header `'x-admin-secret': ADMIN_SECRET`.

**Alternativa pragmática (sin funciones):** mantener la escritura pública solo durante el día del evento y monitorear; la anon key puede rotarse en Settings > API si hay abuso.
