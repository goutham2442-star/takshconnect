@echo off
title TakshConnect Server Manager
echo ==========================================
echo Starting TakshConnect Full-Stack Servers...
echo ==========================================
echo.

echo [1/3] Launching FastAPI Backend (Port 8001)...
start /B cmd /c "cd backend && call venv\Scripts\activate.bat && python main.py"
timeout /t 5 >nul

echo [2/3] Launching Next.js Frontend (Port 3000)...
start /B cmd /c "npm run dev"
timeout /t 10 >nul

echo [3/3] Opening TakshConnect in your browser...
start http://localhost:3000/login

echo.
echo ==========================================
echo All servers are RUNNING.
echo DO NOT close this window.
echo Press any key to STOP all servers and exit...
echo ==========================================
pause >nul

echo.
echo Stopping servers...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
echo Done! Goodbye.
timeout /t 2 >nul
exit
