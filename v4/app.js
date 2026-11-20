(function () {
  "use strict";
  const a = window.ATHLETE;
  if (!a) return;

  // Nocturne reel view count. Source: comment beside sponsorshipReelUrl in data/jamie-lee.js.
  const NOCTURNE_REEL_VIEWS = "1,266";

  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const toDate = (iso) => new Date(iso + "T12:00:00");
  const fmt = (iso, opts) => toDate(iso).toLocaleDateString("en-US", opts);
  const img = (src) => (/^(https?:)?\/\//.test(src) ? src : "../" + src);
  const ordinal = (n) => {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const ext = (el, url, text) => {
    if (!el) return;
    if (!url) { el.hidden = true; return; }
    el.href = url;
    el.target = "_blank";
    el.rel = "noopener";
    if (text) el.textContent = text;
  };
  const seriesTag = (s) => `<span class="tag tag--${esc(String(s).toLowerCase())}">${esc(s)}</span>`;

  const platforms = (a.audience && a.audience.platforms) || [];
  const findPlatform = (re) => platforms.find((p) => re.test(p.label) || re.test(p.name)) || null;
  const followers = findPlatform(/follower/i);
  const engagement = findPlatform(/engagement/i);
  const reels = findPlatform(/reel/i);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcoming = (a.upcoming || [])
    .filter((u) => toDate(u.date) >= today)
    .sort((x, y) => x.date.localeCompare(y.date));
  const results = (a.results || []).slice().sort((x, y) => y.date.localeCompare(x.date));
  const season = upcoming.length ? upcoming[upcoming.length - 1].date.slice(0, 4) : String(new Date().getFullYear());

  const email = (a.contact && a.contact.email) || "";
  const mailto = (subject) => (email ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : "#contact");

  /* ---------- Meta / chrome ---------- */
  document.title = `${a.name} | Sponsor Media Kit ${season}`;
  $("nav-name").textContent = a.name;
  $("nav-season").textContent = season;
  $("contact-season").textContent = season;
  document.querySelectorAll(".js-first").forEach((el) => (el.textContent = a.firstName));
  $("footer-name").textContent = a.name;
  $("year").textContent = new Date().getFullYear();
  $("footer-updated").textContent = "Prepared " + new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  document.querySelectorAll(".js-print").forEach((b) => b.addEventListener("click", () => window.print()));
  document.querySelectorAll(".js-mail").forEach((el) => (el.href = mailto(`Partnership inquiry: ${a.name}`)));
  document.querySelectorAll(".js-mail-kit").forEach((el) => (el.href = mailto(`Media kit request: ${a.name}`)));

  /* ---------- Hero ---------- */
  $("hero-disciplines").textContent = [(a.disciplines || []).join(" · "), a.location].filter(Boolean).join("  /  ");
  $("hero-lede").textContent = a.tagline || "";
  const heroImg = $("hero-img");
  heroImg.src = img(a.heroImage);
  heroImg.alt = `${a.name} leaning on a loaded barbell in a squat rack`;

  const kpis = [];
  if (engagement) kpis.push({ value: engagement.metric, label: `Instagram ${engagement.label}` });
  if (a.stats && a.stats[3]) kpis.push(a.stats[3]);
  if (a.stats && a.stats[1]) kpis.push(a.stats[1]);
  $("hero-kpis").innerHTML = kpis
    .slice(0, 3)
    .map((k) => `<div class="kpi"><dt class="kpi__label">${esc(k.label)}</dt><dd class="kpi__value">${esc(k.value)}</dd></div>`)
    .join("");

  const next = upcoming[0];
  if (next) {
    $("hero-card-title").textContent = next.event;
    $("hero-card-sub").textContent = [fmt(next.date, { month: "short", day: "numeric", year: "numeric" }), next.location, next.goal ? `Goal: ${next.goal}` : ""]
      .filter(Boolean).join(" · ");
    document.querySelector(".hero__card-label").textContent = "Next start line";
  } else {
    document.querySelector(".hero__card").hidden = true;
  }

  /* ---------- 01 At a glance ---------- */
  const hyroxCount = results.filter((r) => r.series === "HYROX").length;
  const divisions = [...new Set(results.map((r) => r.format))];
  const best = results.slice().sort((x, y) => x.place - y.place)[0];
  const facts = [
    ["Disciplines", esc((a.disciplines || []).join(" · "))],
    ["Based in", esc(a.location)],
    ["HYROX races", esc(String(hyroxCount))],
    ["Divisions raced", divisions.map((d) => `<span class="chip">${esc(d)}</span>`).join("")],
    ["Best HYROX finish", best ? `${esc(ordinal(best.place))}, ${esc(best.format)} <span class="muted">· ${esc(best.event)} ${esc(best.date.slice(0, 4))}</span>` : ""],
    ["Personal bests", `${results.filter((r) => r.pb).length} divisions <span class="muted">· see Track record</span>`],
    ["Instagram", followers ? `<a href="${esc(followers.url)}" target="_blank" rel="noopener">${esc(followers.handle)}</a> · ${esc(followers.metric)} ${esc(followers.label)}` : ""],
    ["Engagement", engagement ? `<strong class="accent">${esc(engagement.metric)}</strong> <span class="muted">· ${esc(engagement.handle)}</span>` : ""],
    ["Reel views", reels ? `${esc(reels.metric)} <span class="muted">· ${esc(reels.handle.toLowerCase())}</span>` : ""],
    ["Day job", a.website ? esc(a.website.blurb) : ""],
  ].filter(([, v]) => v);
  $("facts").innerHTML = facts.map(([k, v]) => `<div class="fact"><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join("");

  const portrait = $("portrait-img");
  portrait.src = img(a.portrait);
  portrait.alt = `${a.name} on a rowing machine in her home gym`;
  $("tagline").textContent = a.instagramBio ? `“${a.instagramBio}”` : "";
  $("bio").innerHTML = (a.bio || []).map((p) => `<p>${esc(p)}</p>`).join("");

  /* ---------- 02 Reach ---------- */
  $("audience-summary").textContent = (a.audience && a.audience.summary) || "";
  const reachIcons = [
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
    '<path d="M5 3l14 9-14 9V3z"/>',
  ];
  const reachCards = platforms.map((p, i) => {
    const handle = p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.handle)}</a>` : esc(p.handle);
    return `<article class="card stat">
      <div class="stat__top"><span class="stat__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${reachIcons[i % reachIcons.length]}</svg></span><span class="stat__name">${esc(p.name)}</span></div>
      <div class="stat__value">${esc(p.metric)}</div>
      <div class="stat__label">${esc(p.label)}</div>
      <div class="stat__meta">${handle}</div>
    </article>`;
  });
  // Partnership reel as a fourth proof-point card
  if (a.sponsorshipReelUrl) {
    reachCards.push(`<article class="card stat stat--accent">
      <div class="stat__top"><span class="stat__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8M15 7h6v6"/></svg></span><span class="stat__name">Sponsored reel</span></div>
      <div class="stat__value">${esc(NOCTURNE_REEL_VIEWS)}</div>
      <div class="stat__label">views on the partner reel</div>
      <div class="stat__meta"><a href="${esc(a.sponsorshipReelUrl)}" target="_blank" rel="noopener">Watch the reel</a></div>
    </article>`);
  }
  $("reach-cards").innerHTML = reachCards.join("");
  $("reach-note").textContent = "Instagram stats as of Nov 2026. Engagement = average likes + comments on the last 12 posts, divided by followers.";
  ext($("ig-link"), a.contact && a.contact.instagram, followers ? `Instagram ${followers.handle}` : "Instagram profile");
  ext($("highlights-link"), a.highlightsUrl);

  /* ---------- 03 Proven partner ---------- */
  const partner = (a.partners || [])[0];
  if (partner) {
    const reelUrl = partner.url || a.sponsorshipReelUrl;
    const beatsAvg = reels && parseFloat(NOCTURNE_REEL_VIEWS.replace(/,/g, "")) > parseFloat(reels.metric) * (/k/i.test(reels.metric) ? 1000 : 1);
    $("case").innerHTML = `
      <div class="case__head">
        <span class="badge">Case study</span>
        <span class="muted small">${esc(partner.date)}</span>
      </div>
      <h3 class="case__title">${esc(partner.name)}</h3>
      <p class="case__cat">${esc(partner.category)} partnership</p>
      <div class="case__grid">
        <div class="case__metric">
          <span class="case__num">${esc(NOCTURNE_REEL_VIEWS)}</span>
          <span class="case__label">views on the partnership reel${beatsAvg ? `, above her ${esc(reels.metric)} recent reel average` : ""}</span>
        </div>
        <div>
          <h4 class="mini">Delivered</h4>
          <ul class="ticks ticks--sm">
            <li>Dedicated partnership Reel on Instagram</li>
            <li>${esc(partner.category)} brand, published ${esc(partner.date)}</li>
            <li>Shared with her ${esc(followers ? followers.handle : "Instagram")} audience</li>
          </ul>
        </div>
      </div>
      ${reelUrl ? `<a class="btn btn--primary" href="${esc(reelUrl)}" target="_blank" rel="noopener">Watch the ${esc(partner.name)} reel
        <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>` : ""}`;
  } else {
    $("case").hidden = true;
  }

  const w = a.website || {};
  const blurbParts = String(w.blurb || "").split(":");
  const company = blurbParts.length > 1 ? blurbParts[0].trim() : "Her business";
  const companyLine = blurbParts.length > 1 ? blurbParts.slice(1).join(":").trim() : w.blurb;
  $("pro").innerHTML = `
    <div class="case__head"><span class="badge badge--ink">Brand-side credibility</span></div>
    <h3 class="case__title">${esc(company)}</h3>
    <p class="case__cat">${esc(companyLine)}</p>
    <dl class="pro__facts">
      <div><dt>~20</dt><dd>years in eCommerce &amp; brand growth</dd></div>
      <div><dt>Nike · Sony</dt><dd>among past companies</dd></div>
    </dl>
    <p class="pro__text">Founder of ${esc(company)} and a fractional eCommerce GM and growth advisor for consumer brands. She knows what a partnership has to deliver, and she reports on it.</p>
    ${w.url ? `<a class="link-arrow" href="${esc(w.url)}" target="_blank" rel="noopener">${esc(w.label || w.url)}</a>` : ""}`;

  /* ---------- 04 Why partner ---------- */
  $("values").innerHTML = (a.sponsorValue || [])
    .map((v, i) => `<article class="value">
      <span class="value__num">${String(i + 1).padStart(2, "0")}</span>
      <h3 class="value__title">${esc(v.title)}</h3>
      <p>${esc(v.text)}</p>
    </article>`)
    .join("");

  /* ---------- 05 Packages ---------- */
  const tiers = a.partnershipTiers || [];
  $("tiers").innerHTML = tiers
    .map((t, i) => `<article class="card tier${t.featured ? " tier--featured" : ""}">
      ${t.featured ? '<span class="tier__flag">Recommended</span>' : ""}
      <span class="tier__level">Tier ${i + 1}</span>
      <h3 class="tier__name">${esc(t.name)}</h3>
      <p class="tier__blurb">${esc(t.blurb)}</p>
      <div class="tier__price"><span>Inquire</span><small>Custom quote</small></div>
      <ul class="ticks ticks--sm">${(t.perks || []).map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      <a class="btn ${t.featured ? "btn--primary" : "btn--ghost"} btn--block" href="${esc(mailto(`${t.name} partnership inquiry: ${a.name}`))}">Inquire about ${esc(t.name)}</a>
    </article>`)
    .join("");

  const seen = new Set();
  const items = [];
  tiers.forEach((t) => (t.perks || []).forEach((p) => {
    if (!seen.has(p)) { seen.add(p); items.push({ perk: p, tier: t.name }); }
  }));
  $("checklist").innerHTML = items
    .map((it) => `<li><span class="check" aria-hidden="true"></span><span>${esc(it.perk)}</span><span class="checklist__tier">${esc(it.tier)}</span></li>`)
    .join("");

  /* ---------- 06 Calendar ---------- */
  if (!upcoming.length) {
    $("timeline").outerHTML = '<p class="muted">The next race calendar is being finalized. Get in touch for dates.</p>';
  } else {
    $("timeline").innerHTML = upcoming
      .map((u) => `<li class="tl${u.tentative ? " tl--tentative" : ""}">
        <div class="tl__date">
          <span class="tl__mon">${esc(fmt(u.date, { month: "short" }))}</span>
          <span class="tl__day">${esc(fmt(u.date, { day: "numeric" }))}</span>
          <span class="tl__yr">${esc(u.date.slice(0, 4))}</span>
        </div>
        <span class="tl__dot" aria-hidden="true"></span>
        <div class="tl__body card">
          <div class="tl__tags">${seriesTag(u.series)}${u.tentative ? '<span class="tag tag--tentative">Tentative</span>' : ""}</div>
          <h3 class="tl__event">${esc(u.event)}</h3>
          <p class="tl__loc">${u.location ? esc(u.location) : "Location to be announced"}</p>
          ${u.goal ? `<p class="tl__goal"><span>Goal</span>${esc(u.goal)}</p>` : ""}
        </div>
      </li>`)
      .join("");
  }

  /* ---------- 07 Track record ---------- */
  $("highlights").innerHTML = (a.highlights || []).map((h) => `<li>${esc(h)}</li>`).join("");
  $("pbs").innerHTML = results
    .filter((r) => r.pb)
    .map((r) => `<li class="pb">
      <span class="pb__time">${esc(r.time)}</span>
      <span class="pb__div">${esc(r.format)}</span>
      <span class="pb__meta">${esc(r.event)} · ${esc(fmt(r.date, { month: "short", year: "numeric" }))}${r.place ? ` · ${esc(ordinal(r.place))}` : ""}</span>
    </li>`)
    .join("");
  $("results-count").textContent = `${results.length} races`;
  $("results").innerHTML = results
    .map((r) => `<tr${r.pb ? ' class="is-pb"' : ""}>
      <td class="nowrap">${esc(fmt(r.date, { month: "short", day: "numeric", year: "numeric" }))}</td>
      <td>${esc(r.event)}${r.partners ? `<span class="partners">with ${esc(r.partners)}</span>` : ""}</td>
      <td>${esc(r.format)}</td>
      <td class="num">${esc(r.time)}${r.pb ? ' <span class="pbmark" title="Personal best">PB</span>' : ""}</td>
      <td class="num">${esc(ordinal(r.place))}</td>
    </tr>`)
    .join("");

  const q = a.interview;
  if (q && q.quote) {
    $("quote").innerHTML = `
      <blockquote><p>${esc(q.quote)}</p></blockquote>
      <figcaption>
        <span><strong>${esc(a.name)}</strong> in <cite>${esc(q.title)}</cite>${q.subtitle ? `: ${esc(q.subtitle)}` : ""}${q.date ? `, ${esc(q.date)}` : ""}</span>
        ${q.url ? `<a class="link-arrow" href="${esc(q.url)}" target="_blank" rel="noopener">Read the interview</a>` : ""}
      </figcaption>`;
  } else {
    $("quote").hidden = true;
  }

  /* ---------- 08 Gallery ---------- */
  $("gallery-grid").innerHTML = (a.gallery || [])
    .map((g) => `<figure class="shot"><img src="${esc(img(g.src))}" alt="${esc(g.alt)}" loading="lazy"${g.position ? ` style="object-position:${esc(g.position)}"` : ""} /><figcaption>${esc(g.alt)}</figcaption></figure>`)
    .join("");

  /* ---------- Contact ---------- */
  const ce = $("contact-email");
  ce.textContent = email || "Get in touch";
  ext($("contact-ig"), a.contact && a.contact.instagram, followers ? followers.handle : "Instagram");
  ext($("contact-web"), w.url, w.label);

  // Open full results when printing so the PDF includes them
  const det = $("results-wrap");
  let wasOpen = false;
  window.addEventListener("beforeprint", () => { wasOpen = det.open; det.open = true; });
  window.addEventListener("afterprint", () => { det.open = wasOpen; });
})();
