# 🎪 Mapa Interactivo para Eventos & Ferias en Canchas

Aplicación web móvil (PWA/Web App) diseñada para ferias, kermesses vecinales, eventos costumbristas o festivales en canchas y recintos abiertos.

## 🚀 ¿Cómo probarlo ahora mismo?

### Opción 1: Abrir directamente en el navegador (PC)
1. Haz doble clic en el archivo [`index.html`](file:///C:/Users/sorte/.gemini/antigravity/scratch/mapa-villa-evento/index.html).
2. Se abrirá en Google Chrome, Edge o tu navegador favorito.

### Opción 2: Probarlo en tu Celular (en la misma red Wi-Fi de tu casa)
Para ver cómo funciona la geolocalización real caminando por la cancha o tu villa:
1. Abre una terminal de comandos en esta carpeta y ejecuta un servidor local rápido:
   ```bash
   npx serve .
   # o con Python si lo tienes instalado:
   python -m http.server 8080
   ```
2. Desde el navegador de tu celular, ingresa a la IP local de tu computador (por ejemplo: `http://192.168.1.15:8080`).

---

## 🧭 Funcionalidades preparadas para tu prueba

1. **📍 Punto Azul GPS con Pulso:** 
   - Detecta las coordenadas del celular del visitante con precisión de metros.
   - Si estás probando desde el PC en tu casa, presiona el botón **🚶‍♂️ (Modo Simulación)** y haz clic en cualquier lugar del mapa para simular que caminas por la cancha.

2. **🛰️ Vista Satelital vs Calles:**
   - Botón superior para alternar entre vista de calles o satélite en alta resolución (ideal para ver el pasto, arcos de la cancha y árboles).

3. **🍔 Puestos con Badges y Colores:**
   - Insignias circulares con íconos temáticos:
     - 🍔 Naranja: Food Trucks y comida.
     - 🍺 Amarillo: Cerveza y barra.
     - 🧶 Verde: Artesanías y productos de vecinos.
     - 🚻 Azul / Morado: Baños químicos, escenario y boletería.

4. **🧭 "¿Cómo llegar?" con Distancia en Vivo:**
   - Toca cualquier puesto y presiona "¿Cómo llegar?".
   - Se trazará una línea guía punteada naranja y un HUD superior indicando la distancia en tiempo real (ej. *"A 28 metros de distancia"*).

5. **📍+ Modo Diseñador / Organizador:**
   - ¿Quieres mapear la cancha de tu villa en 2 minutos? Presiona el botón flotante **`📍+`** y luego haz clic sobre la cancha o plaza. Podrás poner el nombre del vecino o negocio, categoría y descripción, y quedará guardado de inmediato.
