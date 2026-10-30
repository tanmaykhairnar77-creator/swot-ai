# SWOT AI

A friendly SWOT analysis chat for college students, by Tanmay Khairnar.

## How it is organised
- `public/index.html` is the WEBSITE (everything users see). It contains no secrets.
- `functions/api/ai.js` is the AI part. It runs on Cloudflare and calls Cloudflare's Workers AI.
- `wrangler.toml` tells Cloudflare where the site is and switches on the AI connection.

## Deploy (free)
### 1. Put the code on GitHub
1. Make a free account at github.com and click **New repository**. Name it `swot-ai`, keep it Public (or Private), click **Create**.
2. Click **uploading an existing file**. Drag in the contents of this folder (`public`, `functions`, `wrangler.toml`, `.gitignore`, `README.md`). Folders must keep their structure.
3. Click **Commit changes**.

### 2. Publish on Cloudflare Pages
1. Make a free account at dash.cloudflare.com.
2. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**, and pick your `swot-ai` repository.
3. Settings: Framework preset **None**, Build command **empty**, Build output directory **public**. Click **Save and Deploy**.
4. When it finishes you get a link like `https://swot-ai.pages.dev`. Share it.

### 3. Check that the AI works
Open the link and answer the four questions. If insights appear, it works. If you see an error, open Workers & Pages → your project → Settings → Bindings and confirm a **Workers AI** binding named `AI` exists (add it if not, then redeploy).

## Good to know
- Free AI allowance: Cloudflare gives 10,000 "neurons" per day for free. A full session is small, but around 50 complete sessions in one day may use it up. Then the AI says it is unavailable until 00:00 UTC. You are not charged unless you upgrade to a paid plan.
- The free model is smaller than Claude, so insights can be simpler and sometimes need a Retry. Model names are retired over time; if the AI stops working, change `MODEL` at the top of `functions/api/ai.js`.
- Privacy: answers are sent to Cloudflare's AI to get a response. Chats are saved only in each user's own browser.
- Anyone with the link can use the AI endpoint. It is limited to your site and to short prompts; the free daily allowance is the final safety limit.
