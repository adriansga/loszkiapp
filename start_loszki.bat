@echo off
cd /d "%~dp0"

set PORT=5100

echo Zatrzymywanie starej instancji Loszki (port %PORT%)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

:: Sprawdz czy node_modules/.bin istnieje
if not exist "node_modules\.bin\" (
    echo Brak node_modules/.bin - uruchamiam npm install...
    npm install
)

echo Uruchamianie Loszki App na http://localhost:%PORT%...
start "Loszki App Server" npm run dev -- -p %PORT%

echo Czekam na uruchomienie serwera...
:wait
timeout /t 2 /nobreak >nul
netstat -ano | findstr :%PORT% >nul 2>&1
if errorlevel 1 goto wait

echo Otwieram przegladarke...
start "" http://localhost:%PORT%
