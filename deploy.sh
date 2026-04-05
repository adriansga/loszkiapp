#!/bin/bash
# deploy.sh — jeden skrypt zamiast git add + commit + push
# Użycie: bash deploy.sh "opis zmiany"
#         bash deploy.sh  (bez opisu → auto-wiadomość z datą)

set -e
cd "$(dirname "$0")"

MSG="${1:-auto: deploy $(date '+%Y-%m-%d %H:%M')}"

echo "→ git add -A"
git add -A

# Jeśli nie ma żadnych zmian — informuj i wyjdź
if git diff --cached --quiet; then
  echo "Brak zmian do commitowania."
  exit 0
fi

echo "→ git commit: $MSG"
git commit -m "$MSG"

echo "→ git push origin main"
git push origin main

echo ""
echo "✓ Deploy pushed. Vercel buduje — https://loszkiapp.vercel.app"
