#!/usr/bin/env bash
# Non-interactive Vercel deployment script (Option B)
# Requires environment variables:
#   VERCEL_TOKEN       (Personal or team token)
#   VERCEL_ORG_ID      (Organization ID)
#   VERCEL_PROJECT_ID  (Project ID)
# Optional: FRONTEND env vars passed via --env (first deploy or to update)
# Usage:
#   chmod +x scripts/deploy-vercel.sh
#   ./scripts/deploy-vercel.sh --with-env   # pushes VITE_* values
#   ./scripts/deploy-vercel.sh              # deploy using existing env on Vercel
set -euo pipefail

if ! command -v vercel >/dev/null 2>&1; then
  echo "[deploy] Installing Vercel CLI..." >&2
  npm install -g vercel >/dev/null 2>&1 || { echo "Failed to install vercel"; exit 1; }
fi

: "${VERCEL_TOKEN:?VERCEL_TOKEN not set}";
: "${VERCEL_ORG_ID:?VERCEL_ORG_ID not set}";
: "${VERCEL_PROJECT_ID:?VERCEL_PROJECT_ID not set}";

WITH_ENV=false
if [[ "${1:-}" == "--with-env" ]]; then
  WITH_ENV=true
fi

echo "[deploy] Building production bundle..."
npm run build

# Construct env flags if requested
ENV_FLAGS=()
if $WITH_ENV; then
  # Read from .env.local (simple parser, ignores comments)
  if [[ -f .env.local ]]; then
    while IFS='=' read -r k v; do
      [[ -z "$k" || "$k" =~ ^# ]] && continue
      if [[ $k == VITE_* ]]; then
        # Trim quotes
        v=${v%"}; v=${v#"}
        ENV_FLAGS+=(--env "$k=$v")
      fi
    done < .env.local
  fi
  echo "[deploy] Passing frontend env vars: ${ENV_FLAGS[*]}"
fi

echo "[deploy] Deploying to Vercel (prod)..."
vercel deploy \
  --prod \
  --yes \
  --token "$VERCEL_TOKEN" \
  --org-id "$VERCEL_ORG_ID" \
  --project-id "$VERCEL_PROJECT_ID" \
  "${ENV_FLAGS[@]}" || { echo "[deploy] Vercel deploy failed"; exit 1; }

echo "[deploy] Done. Visit Vercel dashboard for domain & logs."