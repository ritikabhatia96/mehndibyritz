# Mehndibyritz — Setup Guide

A step-by-step guide to get your henna inspiration portal running.

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, give it a name (e.g. `mehndibyritz`), set a database password, and choose a region.
3. Wait for the project to provision (~1 minute).

---

## Step 2: Run the Database Schema

1. In your Supabase project, go to **SQL Editor** in the sidebar.
2. Click **New Query**.
3. Copy and paste the entire contents of `supabase/schema.sql` into the editor.
4. Click **Run**.

This creates the `users` and `uploads` tables with proper indexes and RLS.

---

## Step 3: Create the Storage Bucket

1. In your Supabase project, go to **Storage** in the sidebar.
2. Click **New Bucket**.
3. Name it exactly: `inspirations`
4. Check **Public bucket** (so images can be accessed via URL without auth tokens).
5. Click **Save**.

---

## Step 4: Set Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in the values:

   - `NEXT_PUBLIC_SUPABASE_URL` — your project URL (e.g. `https://abcxyz.supabase.co`). Found in **Project Settings → API**.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your anon/public key. Found in **Project Settings → API → Project API keys**.
   - `SUPABASE_SERVICE_ROLE_KEY` — your service role key (keep this secret!). Found in **Project Settings → API → Project API keys → service_role**.
   - `JWT_SECRET` — a random 32+ character string. Generate one with:
     ```bash
     openssl rand -base64 32
     ```

---

## Step 5: Create the First Admin Account

Since there's no registration UI (by design), you need to create the first admin user directly in Supabase.

**Option A: Use Supabase SQL Editor**

You'll need a bcrypt hash of your chosen password. Use one of these methods:

*Method 1 — Quick online generator:*
Go to [bcrypt-generator.com](https://bcrypt-generator.com), enter your password, use **12 rounds**, copy the hash.

*Method 2 — Node.js script (most accurate):*
```bash
node -e "const b = require('bcryptjs'); b.hash('YOUR_PASSWORD_HERE', 12).then(h => console.log(h))"
```
(Run this after `npm install` in step 6.)

Then run this in the **Supabase SQL Editor** (replace the placeholders):

```sql
INSERT INTO users (username, display_name, password_hash, role)
VALUES (
  'ritz',                          -- your chosen username (lowercase)
  'Ritz',                          -- your display name
  '$2a$12$REPLACE_WITH_REAL_HASH', -- bcrypt hash from above
  'admin'
);
```

**Option B: Use the Supabase Table Editor**

1. Go to **Table Editor → users** in Supabase.
2. Click **Insert row**.
3. Fill in `username`, `display_name`, `password_hash` (bcrypt hash), `role` = `admin`.
4. Click **Save**.

---

## Step 6: Install Dependencies

```bash
cd /Users/ritika/mehndibyritz
npm install
```

---

## Step 7: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- You'll be redirected to `/login`.
- Sign in with the admin credentials you created in Step 5.
- Go to **Admin** in the nav to create client accounts.

---

## Step 8: Deploy to Vercel

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/mehndibyritz.git
   git push -u origin main
   ```
   > Note: Make sure `.env.local` is in your `.gitignore` (it should be by default with Next.js).

2. Go to [vercel.com](https://vercel.com), click **New Project**, and import your GitHub repo.

3. Add environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`

4. Click **Deploy**.

Your app will be live at `https://your-project.vercel.app`.

---

## How to Add Clients

Once logged in as admin:

1. Go to the **Admin** page (link in nav).
2. Fill in the **Add Client** form with the client's display name, a username, and a temporary password.
3. Share the username + temporary password with your client.
4. Clients can log in and upload their own inspiration photos at `/my-folder`.
5. Anyone (logged in) can browse all boards at `/dashboard`.

---

## Supabase Storage CORS (if needed)

If you experience CORS issues with image uploads, go to **Supabase → Storage → Policies** and ensure the `inspirations` bucket has public read access. The schema.sql has RLS enabled but the app uses the service role key server-side, so this should work out of the box.

---

## Tech Stack Reference

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | jose (JWT in httpOnly cookies) |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Passwords | bcryptjs (12 rounds) |
| Deployment | Vercel |
