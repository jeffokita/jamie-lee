# Jamie's athlete page: handoff

The `athlete/` folder is your finished sponsor page (Studio colors), ready to become **jamiealee.com/athlete/**. Everything your Claude needs is in `athlete/CLAUDE.md`.

## Install it on your site (once)

Use **Claude Code** (the desktop app's Code tab, or `claude` in a terminal), opened in a folder where it can work with your website's GitHub repository. Paste this:

> I want to add my athlete sponsorship page to my website as a subpage at jamiealee.com/athlete/. My site is a Lovable project (React + Vite) synced to GitHub and deployed on Vercel; my domain is managed in Squarespace.
>
> 1. Download the page from https://github.com/jeffokita/jamie-lee (the `handoff/athlete` folder), e.g. `git clone --depth 1 https://github.com/jeffokita/jamie-lee /tmp/jamie-lee`.
> 2. Read `handoff/athlete/CLAUDE.md` and follow its "Adding to jamiealee.com" steps: find and clone my site's GitHub repo (ask me for the URL if you can't find it), copy the folder to `public/athlete/`, keep CLAUDE.md out of `public/` (save it as `docs/athlete-page.md` so you can use it for future edits), update `vercel.json`, and add an "Athlete" link to my site's navigation with a plain `<a href="/athlete/">`.
> 3. Build and preview locally, and show me the page at /athlete/ before publishing.
> 4. When I approve, commit and push to the branch Vercel deploys, then confirm the live page loads.
>
> Never add teammate or partner names, and never invent race results.

## Making changes later

Open Claude Code in your site's repository and ask in plain English, for example:

- "On my athlete page, add my Beaverton half marathon: 1:44:52, Sept 14, 2024, and remove the approx flag."
- "Add these race photos to the gallery" (attach them).
- "Change the 2027 story chapter to say…"

Claude will read `docs/athlete-page.md`, edit `public/athlete/data.js`, preview, and push when you approve. Vercel publishes within a minute or two.

If you edit the rest of the site in Lovable, tell Lovable not to change `public/athlete/`.
