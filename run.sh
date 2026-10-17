#!/usr/bin/env bash
# ==============================================================
#  ClipperPulse - 1-Click System Launcher (macOS / Linux)
#  Auto-configures dependencies, LLM connection defaulter & server
# ==============================================================

set -e

# Color helpers
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "=============================================================="
echo "  ⚡ ClipperPulse - Viral Video Repurposing & Trend Studio"
echo "  Automated 1-Click System Runner with LLM Connection Defaulter"
echo "=============================================================="
echo -e "${NC}"

# 1. Verify Node.js installation
if ! command -v node >/dev/null 2>&1; then
  echo -e "${RED}[ERROR] Node.js is not installed!${NC}"
  echo "Please install Node.js (v18 or higher recommended) from: https://nodejs.org"
  exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js detected:${NC} ${NODE_VERSION}"

# 2. Check and initialize environment file
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo -e "${YELLOW}ℹ Creating .env from .env.example...${NC}"
    cp .env.example .env
  else
    echo -e "${YELLOW}ℹ Initializing default .env...${NC}"
    echo "PORT=3000" > .env
    echo "LOCAL_LLM_ENDPOINT=http://localhost:11434" >> .env
  fi
fi

# 3. Check for package manager and install dependencies
if [ ! -d "node_modules" ]; then
  echo -e "${BLUE}📦 Installing project dependencies...${NC}"
  if command -v npm >/dev/null 2>&1; then
    npm install
  elif command -v bun >/dev/null 2>&1; then
    bun install
  elif command -v pnpm >/dev/null 2>&1; then
    pnpm install
  else
    echo -e "${RED}[ERROR] No supported package manager found (npm, bun, or pnpm required).${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ Dependencies installed successfully.${NC}"
else
  echo -e "${GREEN}✓ Dependencies verified.${NC}"
fi

# 4. Probe Local LLM (Ollama)
echo -e "${CYAN}🤖 Probing LLM Connection Defaulter...${NC}"
if curl -s --max-time 1.5 http://localhost:11434/api/tags >/dev/null 2>&1; then
  echo -e "${GREEN}✓ Local Ollama detected at http://localhost:11434! Auto-defaulter will route local AI.${NC}"
elif [ -n "$GEMINI_API_KEY" ]; then
  echo -e "${GREEN}✓ Cloud Gemini API Key detected! Cloud engine active.${NC}"
else
  echo -e "${YELLOW}ℹ No local Ollama or Gemini API key found.${NC}"
  echo -e "${GREEN}✓ Autonomous Heuristics Engine will automatically default for zero-friction operation.${NC}"
  echo -e "  (To use Ollama: install from https://ollama.com and run 'ollama run llama3.2')"
fi

# 5. Open browser in background
(
  sleep 2.5
  URL="http://localhost:3000"
  if command -v open >/dev/null 2>&1; then
    open "$URL" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL" >/dev/null 2>&1 || true
  fi
) &

echo -e "\n${GREEN}🚀 Starting ClipperPulse studio on port 3000...${NC}"
echo -e "${CYAN}🌐 Local Studio URL: http://localhost:3000${NC}\n"

# Run dev server
npm run dev
