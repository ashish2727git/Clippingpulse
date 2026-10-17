#!/usr/bin/env bash
# ==============================================================
#  ClipperPulse - Git Remote & Push Helper
#  Easily link your local repo to GitHub / GitLab and push
# ==============================================================

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}==============================================================${NC}"
echo -e "${CYAN}  🚀 ClipperPulse Git Setup & Push Assistant${NC}"
echo -e "${CYAN}==============================================================${NC}\n"

# Verify git
if ! command -v git >/dev/null 2>&1; then
  echo -e "${RED}[ERROR] git command not found. Please install git.${NC}"
  exit 1
fi

# Ensure git is initialized
if [ ! -d ".git" ]; then
  echo -e "${YELLOW}ℹ Initializing git repository on branch main...${NC}"
  git init -b main
fi

# Check status
echo -e "${BLUE}Staging all changes...${NC}"
git add .

# Check if commit needed
if git diff-index --quiet HEAD -- 2>/dev/null; then
  echo -e "${GREEN}✓ Working tree is clean. Ready to push.${NC}"
else
  echo -e "${YELLOW}Creating commit...${NC}"
  git commit -m "feat: complete ClipperPulse studio with multi-sector radar, subtitle styles, creator notepad, and LLM defaulter"
fi

# Check existing remote
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")

if [ -n "$CURRENT_REMOTE" ]; then
  echo -e "\n${GREEN}Current git remote 'origin':${NC} $CURRENT_REMOTE"
  read -p "Do you want to push to this remote now? (y/n) " PUSH_NOW
  if [[ "$PUSH_NOW" =~ ^[Yy]$ ]]; then
    git branch -M main
    git push -u origin main
    echo -e "\n${GREEN}✓ Successfully pushed to $CURRENT_REMOTE!${NC}"
    exit 0
  fi
fi

echo -e "\n${YELLOW}Please enter your Git repository URL (e.g., https://github.com/your-username/clipperpulse.git):${NC}"
read -p "Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
  echo -e "${RED}[ERROR] No URL provided. Aborting.${NC}"
  exit 1
fi

if [ -n "$CURRENT_REMOTE" ]; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

git branch -M main
echo -e "\n${CYAN}Pushing to $REPO_URL...${NC}"
git push -u origin main

echo -e "\n${GREEN}==============================================================${NC}"
echo -e "${GREEN}  🎉 All code successfully pushed to Git!${NC}"
echo -e "${GREEN}==============================================================${NC}"
