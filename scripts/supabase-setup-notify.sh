#!/usr/bin/env bash
# Automates Supabase notification setup for CF TechLab
# Usage: ./scripts/supabase-setup-notify.sh -r <PROJECT_REF> -k <RESEND_API_KEY> -f "CF TechLab <no-reply@domain.com>" -t owner@domain.com,team@domain.com \
#        --brand "CF TechLab" --ack "Thanks from CF TechLab" --no-ack (if you want to skip user ack)
# Requires: supabase CLI logged in (run `supabase login` first)

set -euo pipefail

ACK_SUBJECT_PREFIX_DEFAULT="Thanks from CF TechLab"
BRAND_NAME_DEFAULT="CF TechLab"
SEND_USER_ACK=true

usage() {
  grep '^#' "$0" | sed -e 's/^# //'
}

PROJECT_REF=""
RESEND_API_KEY=""
NOTIFY_FROM=""
NOTIFY_TO=""
BRAND_NAME="${BRAND_NAME_DEFAULT}"
ACK_SUBJECT_PREFIX="${ACK_SUBJECT_PREFIX_DEFAULT}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -r|--ref|--project-ref) PROJECT_REF="$2"; shift 2;;
    -k|--resend-key) RESEND_API_KEY="$2"; shift 2;;
    -f|--from) NOTIFY_FROM="$2"; shift 2;;
    -t|--to) NOTIFY_TO="$2"; shift 2;;
    --brand) BRAND_NAME="$2"; shift 2;;
    --ack) ACK_SUBJECT_PREFIX="$2"; shift 2;;
    --no-ack) SEND_USER_ACK=false; shift 1;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 1;;
  esac
done

if [[ -z "$PROJECT_REF" || -z "$RESEND_API_KEY" || -z "$NOTIFY_FROM" || -z "$NOTIFY_TO" ]]; then
  echo "ERROR: Missing required arguments" >&2
  usage
  exit 1
fi

echo "== Linking project (if not already) =="
supabase link --project-ref "$PROJECT_REF" || true

echo "== Setting secrets =="
supabase secrets set \
  RESEND_API_KEY="$RESEND_API_KEY" \
  NOTIFY_FROM="$NOTIFY_FROM" \
  NOTIFY_TO="$NOTIFY_TO" \
  SEND_USER_ACK="${SEND_USER_ACK}" \
  BRAND_NAME="$BRAND_NAME" \
  ACK_SUBJECT_PREFIX="$ACK_SUBJECT_PREFIX"

echo "== Deploying function: notify =="
supabase functions deploy notify

echo "== Test call (contact event) =="
TEST_JSON='{"type":"contact","id":"cli-test-'"$(date +%s)"'","meta":{"name":"CLI Test","email":"cli-test@example.com","message":"Hello"}}'
FUNCTION_URL="https://${PROJECT_REF}.functions.supabase.co/notify"
# Try to get anon key from local env if present
if [[ -f .env.local ]]; then
  ANON_KEY=$(grep VITE_SUPABASE_ANON_KEY .env.local | head -n1 | cut -d'=' -f2-)
else
  ANON_KEY="YOUR_ANON_KEY_HERE"
fi

curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H 'Content-Type: application/json' \
  -d "$TEST_JSON" \
  "$FUNCTION_URL" | grep -q '200' && echo "Test request accepted (HTTP 200)" || echo "Test request NOT 200 - check logs"

echo "Done. Check your inbox (owner) and optionally the cli-test@example.com mailbox (if real) for emails."
