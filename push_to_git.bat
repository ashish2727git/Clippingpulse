@echo off
REM ==============================================================
REM  ClipperPulse - Git Remote & Push Helper (Windows)
REM  Easily link your local repo to GitHub / GitLab and push
REM ==============================================================

title ClipperPulse Git Push Assistant
cls

echo ==============================================================
echo   ClipperPulse Git Setup & Push Assistant
echo ==============================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo [ERROR] git command not found. Please install Git from https://git-scm.com
  pause
  exit /b 1
)

if not exist .git (
  echo [INFO] Initializing git repository on branch main...
  git init -b main
)

echo [INFO] Staging all files...
git add .

git commit -m "feat: complete ClipperPulse studio with multi-sector radar, subtitle styles, creator notepad, and LLM defaulter" 2>nul

echo.
set /p REPO_URL="Enter your Git repository URL (e.g. https://github.com/username/clipperpulse.git): "

if "%REPO_URL%"=="" (
  echo [ERROR] No URL provided.
  pause
  exit /b 1
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo [INFO] Pushing main branch to %REPO_URL%...
git push -u origin main

if %ERRORLEVEL% equ 0 (
  echo.
  echo ==============================================================
  echo   Successfully pushed to Git repository!
  echo ==============================================================
) else (
  echo.
  echo [ERROR] Git push failed. Verify your repository URL and SSH/HTTPS credentials.
)

pause
