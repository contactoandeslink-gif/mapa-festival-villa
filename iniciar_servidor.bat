@echo off
title Servidor Mapa Villa Evento
echo ========================================================
echo   🎪 SERVIDOR LOCAL - MAPA VILLA EVENTO
echo ========================================================
echo.
echo   En tu computador puedes abrir:
echo   --^> http://localhost:8000
echo.
echo   En tu celular (mismo Wi-Fi):
echo   --^> http://192.168.1.12:8000
echo.
echo   Presiona Ctrl + C en esta ventana para detenerlo.
echo ========================================================
echo.
cd /d "%~dp0"
python -m http.server 8000
