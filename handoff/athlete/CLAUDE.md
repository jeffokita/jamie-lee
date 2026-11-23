# Jamie Lee athlete page: guide for Claude

This folder is a self-contained static web page: Jamie Lee's sponsorship profile as a hybrid fitness athlete (HYROX, DEKA, ATHX). It is meant to live as a subpage of her website at **https://www.jamiealee.com/athlete/**. There's no build step and no framework: plain HTML, CSS and vanilla JavaScript.

## Files

| File | What it is |
|---|---|
| `index.html` | Page structure and meta tags (title, description, link-preview tags, canonical URL). |
| `styles.css` | All styling. Colors come from CSS custom properties per theme. |
| `app.js` | Renders every section from `data.js`. |
| `data.js` | **All content.** Sets `window.ATHLETE`. Almost every edit happens here. |
| `images/` | Photos referenced from `data.js` (paths relative to this folder, e.g. `images/hero.jpg`). |
| `og-image.jpg` | 1200x630 link-preview image (shown when the URL is shared). |

## Making content edits

Edit `data.js` and the page updates; no other file needs to change for normal content updates. Key fields:

- `tagline`, `lateBloomer`, `instagramBio` (hero headline), `category` (hero badge), `positioning`, `mom`
- `stats` (stat strip; first item is the podium count), `highlights` (ticker + Athlete card; put 2026-and-newer items first, as items mentioning the current year are shown first and more often)
- `story` (timeline chapters: `year`, `title`, `text`)
- `pbProgressions` (Performance section). Each track: `{ event, format, team?, featured?, entries: [...] }`
  - Entries are PRs in date order: `{ date: "YYYY-MM-DD" | null, race, time, percentile?, note?, dateLabel?, approx? }`
  - `time`: "h:mm:ss", "mm:ss", or with tenths ("23:54.7")
  - `team: true` puts the track under "Doubles & teams"
  - `featured: false` keeps a track on the PB board only (no big first → PB block)
  - `dateLabel` replaces the displayed date (e.g. "2023 season"); `date: null` entries are left out of charts
  - `approx: true` shows the time as "≈" (use for times from memory, until the exact result is found)
- `athxFinishes` (ATHX leaderboard cards: `place`, `ageGroupPlace`, `segments`, `individual`)
- `upcoming` (race calendar; past dates hide automatically; optional `events`, `goal`, `tentative`)
- `results` (race history used for reference; the page doesn't show a full results table)
- `brands`, `partners`, `podcasts`, `podcastsIntro`, `funFacts`, `sponsorValue`, `partnershipTiers`, `gallery`, `contact`

Empty arrays and `null` values hide their section or item, so it's safe to clear things.

## Content rules (from Jamie)

- **Never include teammate or partner names** anywhere (doubles, relays, pairs, teams).
- **Never invent or estimate results.** Use only real records. If Jamie gives a time from memory, add it with `approx: true` until there's an exact source.
- Say **"DEKA"**, not "Spartan DEKA". Don't put OCR in headers (it's fine in the story).
- Show PBs, progressions and percentiles, not race-by-race tables or raw overall positions ("#147"). Percentile = place ÷ field size, rounded up ("Top 4%").
- Lead with recent accolades. Older wins (e.g. 2023) belong in the story, not the hero or ticker.
- Don't show audience metrics (follower counts, engagement) until they're stronger.
- Keep the hero line exactly: "Building Brands between Boarding Passes, Burpees, & Bedtime Stories".
- "3× DEKA World Championships **competitor**" (she competed; she didn't win three times).
- Calls to action should read as **sponsorship**, not as looking for a race partner ("Sponsor Jamie", "Become a sponsor").
- hyresult.com merges several different Jamie Lees. She doesn't race in Asia, so ignore those entries.

## Theme

The page uses the **Studio** theme, which matches jamiealee.com: cream background, teal, navy, coral accents, Fraunces italic accents. It's set in the small script in `index.html`'s `<head>`. Other themes (volt, flare, electric, chalk, midnight, lagoon, print) still exist in `styles.css`; to switch, change `"studio"` in that script. The review-only color switcher is hidden (`<div class="themer" hidden>`).

## Adding to jamiealee.com (Lovable → GitHub → Vercel)

Jamie's site is a Lovable project (React + Vite + Tailwind), synced to GitHub and deployed on Vercel. The domain is managed through Squarespace, which only needs to keep pointing at Vercel; no DNS change is required for a subpage.

1. **Get the site repo.** In Lovable, the project's GitHub integration shows the repository. Clone it (or work in it if you already have it).
2. **Copy this folder** to `public/athlete/` in the site repo. Vite copies `public/` as-is into the build, so it's served at `/athlete/`. Do not copy this `CLAUDE.md` into `public/` (it would be publicly downloadable). Keep it elsewhere, e.g. `docs/athlete-page.md`, or delete it from the copy.
3. **Check `vercel.json`.** Lovable/Vite apps usually have a catch-all rewrite to `/index.html` for client-side routing. Vercel serves real files first, but add these so `/athlete` and `/athlete/` always load the static page (rewrites go **before** the catch-all):
   ```json
   {
     "redirects": [
       { "source": "/athlete", "destination": "/athlete/", "permanent": true }
     ],
     "rewrites": [
       { "source": "/athlete/", "destination": "/athlete/index.html" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
   Merge with whatever's already there rather than replacing it. The trailing slash matters: the page uses relative paths (`styles.css`, `data.js`, `images/...`), so it must be served at `/athlete/`.
4. **Link to it from the site.** In the React nav/footer, use a plain anchor, `<a href="/athlete/">Athlete</a>`, not a React Router `<Link>`, so the browser does a full page load instead of client-side routing.
5. **Test locally:** `npm install && npm run build && npm run preview`, then open `/athlete/` and `/athlete`. Check the browser console has no errors, images load, and the page looks right on a narrow (phone) window.
6. **Publish:** commit to the branch Vercel deploys (usually `main`). Vercel deploys automatically and Lovable syncs from GitHub. If Jamie edits in Lovable afterwards, pull first to avoid conflicts. Tell Lovable's AI not to modify `public/athlete/`.
7. **After it's live:** confirm https://www.jamiealee.com/athlete/ loads, and test the link preview (e.g. paste the URL into a message).

If the site's live URL isn't `www.jamiealee.com`, or the subpage path changes, update the canonical and `og:` URLs in `index.html`.

## Verifying changes

After any edit: open the page, check the console for errors, and check desktop and phone widths. If the page is blank, `data.js` likely has a syntax error (e.g. a missing comma or quote). Validate it with `node -e "global.window={};require('./data.js');console.log('ok')"` run from this folder.

Safari note: keep `<img>` elements in the DOM directly. Images created off-DOM with `loading="lazy"` never load in Safari.

## Open items (as of Nov 2026)

- Exact times for her half marathon PR (≈1:45, Beaverton Half Marathon, Sept 14, 2024), her first half in her 20s (≈2:11), and her 5K PR (≈20:00, race unknown). These are marked `approx: true`.
- Confirm the 2023 DEKA season bests (FIT 42:25, MILE 24:12, STRONG 16:52), which are listed as "Jamie Lee, Free Agent" with no city.
- Her first solo HYROX race (she recalls ~1:23–1:24), which isn't in the results yet; and which race was her second 2nd-place HYROX podium.
- ATHX endurance ranking field size ("7th in the world in her age division": out of how many?).
- A podium list to back up "20+ podiums".
- Better race-day photos (full resolution, with photographer credit) to replace those in `images/`.
