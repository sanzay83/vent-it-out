# Vent It Out — Supabase setup (free plan)

The app now runs entirely on Supabase: Postgres for posts, Supabase Auth for
accounts, and Realtime for the global chat. The old custom backend
(vio.aapugu.com) is no longer used. ~10 minutes, one time.

## 1. Create the project

1. Go to https://supabase.com → sign up / sign in → **New project**.
2. Name it `vent-it-out`, set a database password, pick the region closest to
   your users, **Create new project** (takes ~1 minute).
3. Once it's ready, go to **Project Settings → API** and copy two values:
   - **Project URL** (looks like `https://xyzcompany.supabase.co`)
   - **anon public** key (long `eyJ...` string)

## 2. Create the tables

1. In Supabase, open the **SQL editor** → **New query**.
2. Open the file `supabase/schema.sql` from this repo, copy everything, paste
   it into the query box, and press **Run**.
3. You should see "Success. No rows returned" — tables, security rules and the
   chat realtime feed are all created.

## 3. Turn off email confirmation (important)

By default Supabase makes new users click a confirmation link before they can
sign in. For this app, turn that off:

1. **Authentication → Sign In / Up** (or Providers → Email).
2. Turn **OFF** "Confirm email".

## 4. Point your local code at the project

Edit `src/config.js` (it's gitignored — never committed):

```js
export const SUPABASE_URL = "https://xyzcompany.supabase.co";
export const SUPABASE_ANON_KEY = "eyJ...your-anon-key...";
```

Then `npm install` (refreshes `package-lock.json`) and `npm start` — register a
test account and everything should work:
feed, posting, likes, sign in/out, and realtime chat.

## 5. Give the GitHub deploy the same keys

The deploy workflow builds the app on GitHub's servers, so it needs the keys
as repository secrets (safe — secrets are never shown in logs):

1. Repo → **Settings → Secrets and variables → Actions → New repository secret**
2. Add `SUPABASE_URL` = your Project URL.
3. Add `SUPABASE_ANON_KEY` = your anon public key.

## 6. Add the deploy workflow (if you haven't yet)

GitHub doesn't let integrations create workflow files, so this is manual:

1. Repo → **Add file → Create new file**, name it `.github/workflows/deploy.yml`.
2. Paste the contents of `deploy-workflow.yml` (in `~/workspace/vent-it-out/`)
   and **Commit** — that commit triggers the first deploy automatically.
3. **Settings → Pages** → Source: *Deploy from a branch* → branch `gh-pages`,
   folder `/ (root)` → **Save**.

Live at `https://sanzay83.github.io/vent-it-out/` a couple of minutes later.
Every push to `master` redeploys automatically.

---

### Notes

- **Free-tier pause:** Supabase pauses the database after ~7 days with zero
  traffic; the first visit after that takes ~10–30s to wake up, then it's
  normal. Fine for this app's scale.
- **Chat online count** uses Supabase Presence — no separate socket server.
- **Likes** are one-per-user, enforced in the database (`like_post()`), so
  refreshing the page can't double-like.
- The old backend's data (if it comes back online) is not migrated — this
  starts fresh. If you want the old posts imported, say the word and I'll
  write an import script.
