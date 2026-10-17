@echo off
REM ==============================================================
REM  ClipperPulse - 1-Click System Launcher (Windows)
REM  Auto-configures dependencies, LLM connection defaulter & server
REM ==============================================================

title ClipperPulse Studio Launcher
cls

echo ==============================================================
echo   ClipperPulse - Viral Video Repurposing & Trend Studio
echo   Automated 1-Click System Runner with LLM Connection Defaulter
echo ==============================================================
echo.

REM 1. Verify Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo [ERROR] Node.js is not found in your system PATH!
  echo Please install Node.js (v18+ recommended) from https://nodejs.org
  pause
  exit /b 1
)

echo [OK] Node.js detected.

REM 2. Check and copy .env
if not exist .env (
  if exist .env.example (
    echo [INFO] Creating .env from .env.example...
    copy .env.example .env >nul
  ) else (
    echo PORT=3000 > .env
    echo LOCAL_LLM_ENDPOINT=http://localhost:11434 >> .env
  )
)

REM 3. Install dependencies if node_modules missing
if not exist node_modules (
  echo [INFO] Installing project dependencies...
  call npm install
  if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b 1
  )
  echo [OK] Dependencies installed.
) else (
  echo [OK] Dependencies verified.
)

REM 4. Launch browser after a short delay
echo.
echo [INFO] Starting local development server on port 3000...
echo [INFO] Local Studio URL: http://localhost:3000
echo.

start "" "http://localhost:3000"

REM 5. Run dev server
call npm run dev
pause
