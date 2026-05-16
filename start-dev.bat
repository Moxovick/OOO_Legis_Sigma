@echo off
set PATH=C:\Users\Den\node20\node-v20.19.2-win-x64;%PATH%
echo Node version:
node --version
echo.

echo Starting backend on http://localhost:8000
start "Sigma Backend" cmd /k "cd /d "%~dp0backend" && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo Waiting 2 seconds for backend...
timeout /t 2 /nobreak >nul

echo Starting frontend on http://localhost:3006
cd /d "%~dp0frontend"
npm run dev
