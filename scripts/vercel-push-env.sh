#!/usr/bin/env bash
set -euo pipefail

# Push all VITE_* variables from .env.local to Vercel (preview + production)
# Usage: ./scripts/vercel-push-env.sh
# Requires: vercel CLI logged in (`vercel whoami`)

if ! command -v vercel >/dev/null 2>&1; then
  echo "[env] vercel CLI not installed. Run: npm i -g vercel" >&2
  exit 1
fi

if [ ! -f .env.local ]; then
  echo "[env] .env.local not found" >&2
  exit 1
fi

# Lightweight project link check (avoid jq dependency)
if [ ! -f .vercel/project.json ]; then
  echo "[env] Project not linked (missing .vercel/project.json). Run: vercel link" >&2
  exit 1
fi
if ! grep -q 'projectId' .vercel/project.json; then
  echo "[env] project.json looks invalid. Re-link: vercel link" >&2
  exit 1
fi

add_one() {
  local key="$1" value="$2"
  # Remove optional surrounding double quotes only if both ends have them
  if [[ "$value" == \"*\" ]]; then
    value=${value#"}
    value=${value%"}
  fi
  printf "\n[env] Adding %s (preview)\n" "$key"
  printf '%s\n' "$value" | vercel env add "$key" preview || true
  printf "[env] Adding %s (production)\n" "$key"
  printf '%s\n' "$value" | vercel env add "$key" production || true
}

while IFS= read -r line; do
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  if [[ "$line" == VITE_* ]]; then
    k=${line%%=*}
    v=${line#*=}
    add_one "$k" "$v"
  fi
done < .env.local

echo "[env] Done. Redeploy with: vercel --prod"
