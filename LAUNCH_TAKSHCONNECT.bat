@echo off
title TakshConnect Launcher
echo [1/3] Starting TakshConnect Backend...
start cmd /k "cd backend && venv\Scripts\activate && python main.py"
timeout /t 5

echo [2/3] Starting TakshConnect Frontend...
start cmd /k "npm run dev"
timeout /t 10

echo [3/3] Opening TakshConnect in Browser...
start http://localhost:3000/login

echo.
echo ==========================================
echo TakshConnect is now RUNNING!
echo Close this window to stop.
echo ==========================================
pause
