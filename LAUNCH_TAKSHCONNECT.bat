@echo off
TITLE TakshConnect - Institutional Command Center
SETLOCAL EnableDelayedExpansion

echo ===================================================
echo   TakshConnect: Official University Portal Launch
echo ===================================================
echo.

:: 1. Cleanup existing ports
echo [1/3] Clearing ports 3000 and 8001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001') do taskkill /f /pid %%a >nul 2>&1
echo Ports cleared.
echo.

:: 2. Start Backend
echo [2/3] Starting AI Backend (Port 8001)...
cd backend
start "TakshConnect-Backend" cmd /c "python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python main.py"
cd ..
echo Backend starting in new window...
echo.

:: 3. Start Frontend
echo [3/3] Starting Next.js Frontend (Port 3000)...
echo.
npm run dev

pause
