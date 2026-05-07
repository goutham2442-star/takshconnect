@echo off
title TakshConnect Academic OS Launcher
color 0C

echo ============================================================
echo      TAKSHCONNECT ACADEMIC OS - STARTUP SEQUENCE
echo ============================================================
echo [1/3] Starting Backend Server (Port 8001)...
start "TakshConnect Backend" cmd /k "cd backend && python main.py"

echo [2/3] Starting Frontend Development Server (Port 3000)...
start "TakshConnect Frontend" cmd /k "npm run dev"

echo [3/3] Opening Dashboard...
timeout /t 5
start http://localhost:3000/dashboard

echo ============================================================
echo      SYSTEMS ACTIVE - HAPPY STUDYING!
echo ============================================================
pause
