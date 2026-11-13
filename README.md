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

## ⚙️ Configuración importante

- **Fecha del evento:** en `index.html`, constante `EVENT_DATE` (formato `'YYYY-MM-DD'`). Con `null` la app asume que el festival es hoy (modo demo). Con fecha definida, fuera de ese día muestra "📅 Próxima edición" en vez de fingir un show en vivo.
- **Coordenadas de la cancha:** constante `DEFAULT_CENTER` en `index.html`.
- **Versión de datos:** `DATA_VERSION` (en `index.html` y `admin.html`, deben coincidir). Súbela cuando cambies los datos por defecto para limpiar cachés viejas de los visitantes.

## 🧭 Funcionalidades

1. **📍 Punto Azul GPS con Pulso:** geolocalización en vivo; si el GPS falla o estás fuera del recinto, avisa en vez de mostrar distancias absurdas.
2. **🛰️ Mapa vectorial del recinto:** cancha, escenario, pasillos y puestos dibujados con Leaflet (funcionan incluso sin teselas si hay mala señal).
3. **🍔 Puestos con fichas completas:** foto, carta con precios, WhatsApp, datos de transferencia, tiempo de preparación y "¿Cómo llegar?" con distancia en vivo.
4. **🎸 Escenario en vivo:** motor de horarios con hora de Chile, pausas técnicas, retrasos y estados (próximo / en vivo / finalizado).
5. **📷 QR por puesto:** carteles imprimibles desde el admin (`?stand=P-01` ubica al visitante frente al puesto).
6. **📴 Offline:** el service worker guarda el app y las teselas visitadas; la app abre sin conexión.

## ⚠️ Notas de seguridad

- El panel `admin.html` **no tiene autenticación**: sus cambios solo se guardan en el navegador donde se editan (localStorage + BroadcastChannel entre pestañas). Para publicar cambios a TODOS los asistentes hace falta un backend compartido (ej. Supabase/Firebase).
- No publiques datos bancarios o personales reales en el código: el repo es público.
