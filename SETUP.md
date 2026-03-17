# AIToolsHub — Supabase + Stripe Setup Guide

Follow these steps **in order**. Takes about 30 minutes total.

---

## STEP 1 — Supabase Setup (10 min)

### 1.1 Create project
1. Go to https://supabase.com → New Project
2. Name: `aitoolshub` | Password: save this securely | Region: `ap-south-1` (Mumbai — closest to you)
3. Wait ~2 minutes for project to spin up

### 1.2 Run database schema
1. Go to **SQL Editor** → **New Query**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste and click **Run**
4. Verify: go to **Table Editor** → you should see `profiles` table

### 1.3 Get API keys
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ keep this secret

### 1.4 Enable Google OAuth (for "Continue with Google")
1. Go to **Authentication** → **Providers** → **Google**
2. Toggle **Enable**
3. Go to https://console.cloud.google.com → New Project → APIs → OAuth 2.0
4. Create credentials → Web application
5. Authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret → paste into Supabase Google provider settings
7. Save

### 1.5 Set site URL
1. Go to **Authentication** → **URL Configuration**
2. Site URL: `https://your-domain.com` (your AWS domain)
3. Add redirect URLs:
   - `https://your-domain.com/auth/callback`
   - `https://your-domain.com/auth/reset-password`
   - `http://localhost:3000/auth/callback` (for local dev)

---

## STEP 2 — Stripe Setup (10 min)

### 2.1 Create account
1. Go to https://stripe.com → sign up
2. Complete business verification (use your personal details for now)

### 2.2 Create products + prices
Go to **Products** → **Add Product** — create these 4:

| Product Name | Price | Billing | Notes |
|---|---|---|---|
| AIToolsHub Pro Monthly | $9.00 | Recurring monthly | Copy price ID → `STRIPE_PRICE_PRO_MONTHLY` |
| AIToolsHub Pro Yearly | $84.00 | Recurring yearly | Copy price ID → `STRIPE_PRICE_PRO_YEARLY` |
| AIToolsHub Team Monthly | $29.00 | Recurring monthly | Copy price ID → `STRIPE_PRICE_TEAM_MONTHLY` |
| AIToolsHub Team Yearly | $276.00 | Recurring yearly | Copy price ID → `STRIPE_PRICE_TEAM_YEARLY` |

Price IDs look like: `price_1OqXXXXXXXXXXXXXX`

### 2.3 Get API keys
Go to **Developers** → **API Keys**:
- Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Secret key → `STRIPE_SECRET_KEY`

### 2.4 Set up webhook
1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://your-domain.com/api/stripe/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 2.5 Enable customer portal
1. Go to **Settings** → **Billing** → **Customer portal**
2. Toggle on: Allow customers to cancel subscriptions
3. Toggle on: Show invoices
4. Save

---

## STEP 3 — Environment Variables (5 min)

### On AWS (EC2 / Elastic Beanstalk)
Add these as environment variables in your AWS console:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_TEAM_MONTHLY=price_...
STRIPE_PRICE_TEAM_YEARLY=price_...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### For local development
Copy `.env.local.example` to `.env.local` and fill in the values.

---

## STEP 4 — Deploy + Test (5 min)

```bash
npm install
npm run build
npm start
```

### Test checklist
- [ ] Sign up with email → check Supabase Table Editor → profiles row created
- [ ] Sign in with Google → redirected to /dashboard
- [ ] Visit /#pricing → click "Start Pro" → redirected to Stripe checkout
- [ ] Complete test payment (use card `4242 4242 4242 4242`, any future date, any CVC)
- [ ] After payment → redirected to /dashboard?upgraded=true
- [ ] Check Supabase → profiles → plan should now be `pro`
- [ ] Visit /prompt-maker → all 8 categories should be unlocked
- [ ] Click "Manage subscription" → opens Stripe portal

---

## Common Issues

**"Invalid login credentials"** — User exists but wrong password. Use forgot password.

**"Email not confirmed"** — User signed up but hasn't clicked confirmation email. Check spam.

**Webhook not firing** — Make sure your AWS security group allows inbound HTTPS on port 443.

**Google OAuth redirect error** — Double check the redirect URI in Google Console matches exactly: `https://your-project-id.supabase.co/auth/v1/callback`

**Stripe webhook signature failed** — You're using the wrong webhook secret. Each endpoint has its own secret.
