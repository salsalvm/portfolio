# Enquiry email (Supabase + Resend)

When someone submits the contact form, the `submit-enquiry` Edge Function:

1. Saves the row to the `enquiry` table
2. Emails **the person who submitted** a confirmation
3. Emails **you** (`ENQUIRY_NOTIFY_EMAIL`) with the enquiry details

## 1. Create a Resend account

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. For production, verify your domain and use a from-address like `Portfolio <hello@yourdomain.com>`
4. Until a domain is verified, Resend only allows sending to your own Resend account email (use that for testing)

## 2. Deploy the function

```bash
npx supabase login
npx supabase link --project-ref tjjzcqduitosevrazuxn
npx supabase functions deploy submit-enquiry
```

## 3. Set secrets

```bash
npx supabase secrets set RESEND_API_KEY=re_xxxxxxxx
npx supabase secrets set ENQUIRY_NOTIFY_EMAIL=salsalvm1997@gmail.com
npx supabase secrets set ENQUIRY_FROM_EMAIL="Portfolio <onboarding@resend.dev>"
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically to Edge Functions.

## 4. Redeploy the site

No extra Vite env vars are required. The browser calls `submit-enquiry` with the existing anon key.
