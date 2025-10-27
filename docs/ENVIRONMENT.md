# Environment variables and local development

This project uses Vite. Client-side environment variables that should be exposed to the browser must begin with `VITE_`.

1. Create a `.env` file at the repository root (do NOT commit secrets):
   ```bash
   cp .env.example .env
   ```
   Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with your Supabase project values.

2. Server-side secrets (service keys) must never be exposed to the client. Store them in your hosting provider’s secret manager or in a server-only `.env`, and never prefix them with `VITE_`.

3. If you accidentally committed a secret, rotate it immediately and remove it from git history (see below).

4. To run locally:
   ```bash
   npm install
   npm run dev
   ```

## Removing secrets from git history

If a secret was committed, rotate the secret in the relevant service and then remove it from the git history using tools like `git filter-repo` or `bfg`.

Example using git-filter-repo (recommended):

```bash
pip install git-filter-repo
# From a fresh clone
git filter-repo --replace-text replacements.txt
# See git-filter-repo docs for details
```

After history rewrite, force-push branches and inform collaborators to re-clone.