# Notification & Email Setup Script (CF TechLab)

Follow these steps once to enable email notifications (owner + user acknowledgment) for contact, testimonial, project and service-request events.

---

## 1. Prerequisites

- Supabase CLI installed: https://supabase.com/docs/guides/cli
- Resend account + API key (or adapt to another provider)
- Project running locally with `.env.local` copied from `.env.example`

## 2. Copy & Fill Environment Variables (Frontend)

Create `.env.local` at project root:

```
cp .env.example .env.local
```

Edit `.env.local`:

- VITE_SUPABASE_URL= https://<project-ref>.supabase.co
- VITE_SUPABASE_ANON_KEY= <anon key>
- VITE_NOTIFICATIONS_ENABLED=true (or false to disable without redeploy)
- (Optional) VITE_SIMULATE_SERVICE_REQUESTS=true while backend endpoint not implemented

Restart `npm run dev` after editing.

## 3. Create / Review Edge Function

Already present at: `supabase/functions/notify/index.ts`
If you change it later, redeploy (step 5).

## 4. Login & Link Supabase Project (CLI)

```bash
supabase login
supabase link --project-ref <project-ref>
```

(Find `project-ref` in your Supabase dashboard URL.)

## 5. Set Function Secrets

```bash
supabase secrets set \
  RESEND_API_KEY=your_resend_key \
  NOTIFY_FROM="CF TechLab <no-reply@yourdomain.com>" \
  NOTIFY_TO="owner@yourdomain.com,team@yourdomain.com" \
  SEND_USER_ACK=true \
  BRAND_NAME="CF TechLab" \
  ACK_SUBJECT_PREFIX="Thanks from CF TechLab"
```

Adjust addresses & branding as needed.

## 6. Deploy the Function

```bash
supabase functions deploy notify
```

Or run automated script (includes secrets + test):

```bash
chmod +x scripts/supabase-setup-notify.sh
./scripts/supabase-setup-notify.sh \
  -r <project-ref> \
  -k <RESEND_API_KEY> \
  -f "CF TechLab <no-reply@yourdomain.com>" \
  -t owner@yourdomain.com,team@yourdomain.com \
  --brand "CF TechLab" \
  --ack "Thanks from CF TechLab"
```

Test from CLI (replace URL + anon key):

```bash
curl -i -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "https://<project-ref>.functions.supabase.co/notify" \
  -d '{"type":"contact","id":"local-test-1","meta":{"name":"Tester","email":"tester@example.com","message":"Hello"}}'
```

Expect 200 and Resend should log an email. (If 501 => secrets missing.)

## 7. Frontend Flow

When a user submits:

- Contact form
- Testimonial (with optional email)
- Project create (admin UI)
- Service request (simulated utility)
  Your React Query mutation success handlers call `sendNotification()` -> Edge Function -> Resend.

If `SEND_USER_ACK=true` and meta includes `email`, user gets acknowledgment.

## 8. Disabling Quickly

- Set `VITE_NOTIFICATIONS_ENABLED=false` in `.env.local` (frontend stops calling function)
- Or remove /unset secrets: `supabase secrets unset RESEND_API_KEY` (function returns 501 Not configured)

## 9. Changing Provider (Optional)

Edit `supabase/functions/notify/index.ts` to switch from Resend to another (e.g., Postmark, Mailgun). Keep JSON contract consistent.

## 10. Troubleshooting

| Issue                  | Cause                                   | Fix                                    |
| ---------------------- | --------------------------------------- | -------------------------------------- |
| 405 Method Not Allowed | Wrong HTTP verb                         | Use POST only                          |
| 501 Not configured     | Missing secrets                         | Re-run secrets set command             |
| 500 Send failed        | Resend API rejected payload             | Check `NOTIFY_FROM` domain, verify key |
| No user ack email      | SEND_USER_ACK not true or no meta.email | Ensure both conditions                 |
| Frontend silent        | VITE_NOTIFICATIONS_ENABLED not true     | Set true & restart dev                 |

Logs (local): run edge function locally before testing:

```bash
supabase functions serve --env-file .env.local
```

Then POST to: `http://localhost:54321/functions/v1/notify`

## 11. Optional: Type Improvements

Add `/// <reference types="deno.ns" />` at top of function for local editor Intellisense.

## 12. Security Notes

Currently RLS disabled (per earlier decisions). Before enabling again:

- Add policies permitting anonymous insert to contact/testimonial tables only as needed
- Use Edge Functions with service role for privileged inserts, not client.

---

Done. After these steps, notifications are live.
