# LDS Apologetics Reference

A personal, searchable reference app for organizing responses to questions and
accusations against The Church of Jesus Christ of Latter-day Saints — browsable
by topic or by scripture, with full-text search and a built-in content editor.

## What's inside

- **Browse by Topic** (`/`) — topics shown as an alphabetized, filterable button
  grid grouped by category. Each topic page shows biblical scriptures (read from
  an LDS perspective), LDS scriptures that give context, and quotations from
  early church fathers, LDS leaders, LDS apologists, and non-LDS scholars.
- **Browse by Scripture** (`/scripture`) — a collapsible tree in canonical
  order: Old Testament → New Testament → Book of Mormon → Doctrine and
  Covenants → Pearl of Great Price, each book in its proper order, each verse
  page showing context, the LDS apologetic interpretation, supporting quotes,
  and links to related topics.
- **Search** (`/search`) — fuzzy full-text search across topics, subtopics,
  scriptures, and quotes at once. Works by keyword, subject, or an author's
  last name.
- **Add / Edit** (`/admin`) — forms for adding or editing topics and scripture
  entries (book/volume ordering and alphabetizing happen automatically). Your
  edits are saved as a draft in your browser; use the **Export** buttons to
  download updated `topics.json` / `scriptures.json` files, then replace the
  files in `data/` and push to GitHub to publish the change.

## Content model

All content lives in two plain JSON files, so it's easy to read, back up, or
hand to Claude to edit directly in a future session:

- `data/topics.json`
- `data/scriptures.json`

Quotes are stored as short excerpts (1-3 sentences) with a full citation,
rather than long reproduced passages, to stay copyright-safe and lightweight.
The app ships with 7 starter topics and 8 cross-referenced scripture entries
covering: the nature of God / theosis, baptism for the dead, premortal
existence, continuing revelation, the Great Apostasy, the Book of Mormon as
additional scripture, and priesthood authority. Add your own as you go.

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Putting it on GitHub

1. Create a new **empty** repository on github.com (no README/license, so it
   doesn't conflict with the files here).
2. From this project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

## Deploying on Vercel

1. Go to https://vercel.com/new and choose **Import Git Repository**.
2. Select the GitHub repo you just pushed. Vercel auto-detects Next.js — no
   configuration needed.
3. Click **Deploy**. You'll get a live URL (e.g. `your-app.vercel.app`) in
   about a minute.
4. Every time you push a change to `main` (including new topics/scriptures),
   Vercel redeploys automatically.

## Adding or editing content going forward

You have two options, and can mix both:

1. **Use the in-app editor** at `/admin` on your deployed (or local) site,
   then export the updated JSON file(s) and commit them.
2. **Ask Claude** in a Cowork session to add or edit a topic/scripture — Claude
   can edit `data/topics.json` / `data/scriptures.json` directly, and you (or
   Claude via git) push the change to GitHub.

## Suggested next steps / ideas to expand this

- Add more topics: Word of Wisdom, tithing, eternal marriage/sealing, the
  Book of Abraham, plural marriage history, DNA and the Book of Mormon,
  the Godhead vs. Trinity, women and the priesthood, etc.
- Add a "difficulty" or "strength of argument" tag to scriptures/quotes so
  you can quickly gauge how strong a given proof text is mid-conversation.
- Add a "counterargument" field alongside each quote/scripture so you can see
  the strongest objection at a glance, not just the supporting case.
- Add tags for "quick reference" one-liners you want at your fingertips
  during a live conversation, separate from the fuller topic writeups.
- Consider a print/export-to-PDF view of a topic for offline use.
