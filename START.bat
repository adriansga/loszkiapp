@echo off
echo === Loszki App — Start ===
cd /d "%~dp0"
echo Instalowanie zaleznosci...
call npm install
echo Uruchamianie serwera...
call npm run dev
pause
