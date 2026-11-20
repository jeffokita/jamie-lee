(function () {
  "use strict";
  const a = window.ATHLETE;
  if (!a) return;

  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const src = (p) => (!p ? "" : /^(https?:)?\/\//.test(p) ? p : "../" + p);
  const fmtDate = (iso, opts = { month: "short", day: "numeric", year: "numeric" }) =>
    new Date(iso + "T12:00:00").toLocaleDateString("en-US", opts);
  const ext = (url) => `href="${esc(url)}" target="_blank" rel="noopener"`;
  const first = a.firstName || a.name.split(" ")[0];
  const galleryPos = (path) => (a.gallery || []).find((g) => g.src === path)?.position || "";

  // Image markup with graceful fallback for a missing file
  const img = (path, alt, pos, eager) =>
    path
      ? `<img ${/race-run/.test(path) ? 'class="crop-cap" ' : ""}src="${esc(src(path))}" alt="${esc(alt)}" ${eager ? "" : 'loading="lazy"'} ${pos ? `style="object-position:${esc(pos)}"` : ""} onerror="this.parentNode.classList.add('is-missing');this.remove()" />`
      : "";

  const IMG = {
    race: "images/race-run.jpg",
    deka: "images/deka-airbike.jpg",
    sled: "images/sled-push.jpg",
  };

  /* ---------- Meta ---------- */
  document.title = `${a.name} | Athlete, Mom, Founder`;
  if (a.draft) $("draft-banner").hidden = false;
  $("nav-name").textContent = a.name;
  $("hero-first").textContent = first;
  $("next-first").textContent = first;
  document.querySelectorAll(".first").forEach((el) => (el.textContent = first));
  $("footer-name").textContent = a.name;
  $("footer-bio").textContent = a.instagramBio || a.tagline;
  $("year").textContent = new Date().getFullYear();

  /* ---------- Hero ---------- */
  // Instagram bio as the headline; italicise the alliterative "B" phrases
  const bio = a.instagramBio || a.tagline;
  const accents = ["Boarding Passes", "Burpees", "Bedtime Stories"];
  let titleHtml = esc(bio);
  accents.forEach((w, i) => {
    titleHtml = titleHtml.replace(esc(w), `<em class="acc acc--${i + 1}">${esc(w)}</em>`);
  });
  $("hero-title").innerHTML = titleHtml;
  $("hero-tagline").textContent = a.tagline;
  $("hero-chips").innerHTML = [...a.disciplines, a.location]
    .filter(Boolean)
    .map((d, i) => `<li class="chip${i === a.disciplines.length ? " chip--loc" : ""}">${esc(d)}</li>`)
    .join("");
  $("hero-media").innerHTML = img(a.heroImage, `${a.name} leaning on a barbell in a squat rack`, "50% 22%", true);
  $("hero-story").href = a.highlightsUrl || a.contact.instagram;
  $("hero-story").setAttribute("aria-label", "Watch Jamie's race-day highlights on Instagram (opens in a new tab)");
  $("hero-story-img").innerHTML = img(IMG.race, "", galleryPos(IMG.race) || "center 85%");
  const usa = a.stats.find((s) => /team usa/i.test(s.value));
  $("hero-sticker").innerHTML = usa ? `<strong>${esc(usa.value)}</strong><span>${esc(usa.label)}</span>` : "";
  if (!usa) $("hero-sticker").remove();

  /* ---------- Three hats ---------- */
  const proHighlight = (a.highlights || []).find((h) => /pro/i.test(h));
  const usaHighlight = (a.highlights || []).find((h) => /team usa/i.test(h));
  const dekaHighlight = (a.highlights || []).find((h) => /deka world/i.test(h));
  const hats = [
    {
      key: "athlete",
      label: "Athlete",
      note: "burpees",
      media: img(IMG.deka, `${first} on the air bike at a Spartan DEKA race`, galleryPos(IMG.deka)),
      lede: `Racing ${a.disciplines.join(", ").replace(/, ([^,]*)$/, ", and $1")}.`,
      points: [usaHighlight, dekaHighlight, proHighlight].filter(Boolean),
    },
    {
      key: "mom",
      label: "Mom",
      note: "bedtime stories",
      media: img(a.portrait, `${first} on a rowing machine in her home gym`, "50% 25%"),
      lede: "Training fits around family, not the other way around.",
      points: [
        "Trains in the cracks of her day: lunch hours, after bedtime, stroller runs",
        "Most of her podium finishes have come since becoming a mom",
        "Went all in on hybrid racing postpartum",
      ],
    },
    {
      key: "founder",
      label: "Founder",
      note: "boarding passes",
      media: `<div class="hat__brand"><span class="hat__brand-kicker">Founder of</span><span class="hat__brand-name">JME Labs</span><span class="hat__brand-url">${esc(a.website?.label || "")}</span></div>`,
      lede: a.website?.blurb || "",
      points: [
        "Fractional eCommerce GM and growth advisor for consumer brands",
        "Nearly 20 years of experience at companies like Nike and Sony",
        "Knows what a partnership needs to deliver, and reports on it",
      ],
    },
  ];
  $("hats-tabs").innerHTML = hats
    .map(
      (h, i) =>
        `<button type="button" role="tab" id="tab-${h.key}" aria-controls="hat-${h.key}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" class="hats__tab hats__tab--${h.key}">${esc(h.label)}</button>`
    )
    .join("");
  $("hats-cards").innerHTML = hats
    .map(
      (h, i) => `<article class="hat hat--${h.key}${i === 0 ? " is-active" : ""}" id="hat-${h.key}" role="tabpanel" aria-labelledby="tab-${h.key}">
        <div class="hat__media arch">${h.media}</div>
        <p class="hand hat__note">${esc(h.note)}</p>
        <h3 class="hat__title"><span class="hat__num">0${i + 1}</span> ${esc(h.label)}</h3>
        <p class="hat__lede">${esc(h.lede)}</p>
        <ul class="hat__points">${h.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        ${h.key === "founder" && a.website?.url ? `<a class="link-arrow" ${ext(a.website.url)}>Visit ${esc(a.website.label)}<span aria-hidden="true"> &rarr;</span></a>` : ""}
      </article>`
    )
    .join("");
  const tabs = [...document.querySelectorAll(".hats__tab")];
  const select = (i) => {
    tabs.forEach((t, j) => {
      t.setAttribute("aria-selected", String(i === j));
      t.tabIndex = i === j ? 0 : -1;
    });
    document.querySelectorAll(".hat").forEach((c, j) => c.classList.toggle("is-active", i === j));
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(i));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const n = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      select(n);
      tabs[n].focus();
    });
  });

  /* ---------- Stats ---------- */
  $("stats").innerHTML = a.stats
    .map((s) => `<li class="stat"><span class="stat__value">${esc(s.value)}</span><span class="stat__label">${esc(s.label)}</span></li>`)
    .join("");

  /* ---------- Story ---------- */
  $("story-portrait").innerHTML = img(IMG.sled, `${first} training the sled push`, galleryPos(IMG.sled) || "50% 40%");
  $("bio").innerHTML = a.bio.map((p) => `<p>${esc(p)}</p>`).join("");
  $("highlights").innerHTML = (a.highlights || []).map((h) => `<li><span>${esc(h)}</span></li>`).join("");

  /* ---------- Quote ---------- */
  const iv = a.interview;
  if (iv) {
    $("quote-text").innerHTML = `<p>${esc(iv.quote)}</p>`;
    $("quote-src").innerHTML = `<strong>${esc(iv.title)}</strong> &middot; ${esc(iv.subtitle)} &middot; ${esc(iv.date)}`;
    $("quote-link").href = iv.url;
  }

  /* ---------- Instagram phones ---------- */
  $("ig-bio").innerHTML = `Her Instagram bio says it best: <span class="hand hand--inline">&ldquo;${esc(a.instagramBio)}&rdquo;</span>`;
  const handle = a.audience?.platforms?.find((p) => p.name === "Instagram")?.handle || "@jamielel";
  const p0 = (a.partners || [])[0];
  const phones = [
    {
      url: a.highlightsUrl,
      media: img(IMG.deka, `${first} racing at Spartan DEKA`, galleryPos(IMG.deka)),
      tag: "Highlight",
      title: "Race day",
      text: "Start lines, stations, and finish-line moments.",
      cta: "Watch highlights",
    },
    p0 && {
      url: p0.url || a.sponsorshipReelUrl,
      media: img(a.portrait, `${first} in her home gym`, "50% 25%"),
      tag: "Brand partner",
      title: p0.name,
      text: `${p0.category} · ${p0.date}`,
      cta: "Watch the partner reel",
    },
    {
      url: a.contact.instagram,
      media: img(IMG.race, `${first} running at a race`, galleryPos(IMG.race) || "center 85%"),
      tag: "Profile",
      title: handle,
      text: a.instagramBio,
      cta: "Follow along",
    },
  ].filter((p) => p && p.url);
  $("phones").innerHTML = phones
    .map(
      (p, i) => `<a class="phone phone--${i + 1}" ${ext(p.url)} aria-label="${esc(p.cta)}: ${esc(p.title)} (Instagram, opens in a new tab)">
        <span class="phone__screen">
          ${p.media}
          <span class="phone__bars" aria-hidden="true"><i class="on"></i><i class="${i > 0 ? "on" : ""}"></i><i class="${i > 1 ? "on" : ""}"></i></span>
          <span class="phone__user" aria-hidden="true"><span class="phone__avatar">${esc(a.name.split(" ").map((w) => w[0]).join(""))}</span>${esc(handle.replace("@", ""))}</span>
          <span class="phone__body">
            <span class="phone__tag">${esc(p.tag)}</span>
            <span class="phone__title">${esc(p.title)}</span>
            <span class="phone__text">${esc(p.text)}</span>
            <span class="phone__cta">${esc(p.cta)} <span aria-hidden="true">&rarr;</span></span>
          </span>
        </span>
      </a>`
    )
    .join("");

  /* ---------- Results ---------- */
  const results = [...a.results].sort((x, y) => y.date.localeCompare(x.date));
  const pbs = results.filter((r) => r.pb);
  $("pbs").innerHTML = pbs
    .map(
      (r) => `<li class="pb">
        <span class="pb__badge">PB</span>
        <span class="pb__format">${esc(r.format)}</span>
        <span class="pb__time">${esc(r.time)}</span>
        <span class="pb__event">${esc(r.event)} &middot; ${esc(fmtDate(r.date, { month: "short", year: "numeric" }))}</span>
        ${r.partners ? `<span class="pb__with">with ${esc(r.partners)}</span>` : ""}
      </li>`
    )
    .join("");
  const SHOW = 6;
  $("res-count").textContent = `${results.length} races, newest first`;
  $("results-list").innerHTML = results
    .map(
      (r, i) => `<li class="res${i >= SHOW ? " res--extra" : ""}">
        <span class="res__date">${esc(fmtDate(r.date, { month: "short", year: "numeric" }))}</span>
        <span class="res__main">
          <span class="res__event">${esc(r.event)}</span>
          <span class="res__meta">${esc(r.format)}${r.partners ? ` &middot; with ${esc(r.partners)}` : ""}</span>
        </span>
        <span class="res__time">${esc(r.time)}${r.pb ? ' <span class="res__pb">PB</span>' : ""}</span>
        <span class="res__place">${r.place != null ? `<strong>#${Number(r.place).toLocaleString("en-US")}</strong><small>in division</small>` : ""}</span>
      </li>`
    )
    .join("");
  const list = $("results-list");
  const more = $("results-more");
  if (results.length <= SHOW) more.remove();
  else
    more.addEventListener("click", () => {
      const open = list.classList.toggle("is-open");
      more.setAttribute("aria-expanded", String(open));
      more.textContent = open ? "Show fewer" : `Show all ${results.length} results`;
    });
  more.textContent = `Show all ${results.length} results`;

  /* ---------- Upcoming ---------- */
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const upcoming = (a.upcoming || []).filter((u) => u.date >= todayIso).sort((x, y) => x.date.localeCompare(y.date));
  $("upcoming").innerHTML = upcoming.length
    ? upcoming
        .map(
          (u, i) => `<li class="ticket ticket--${u.series === "DEKA" ? "deka" : "hyrox"}${i === 0 ? " ticket--soon" : ""}">
            <span class="ticket__date"><span class="ticket__mon">${esc(fmtDate(u.date, { month: "short" }))}</span><span class="ticket__day">${esc(fmtDate(u.date, { day: "numeric" }))}</span><span class="ticket__yr">${esc(fmtDate(u.date, { year: "numeric" }))}</span></span>
            <span class="ticket__body">
              <span class="ticket__tags"><span class="ticket__series">${esc(u.series)}</span>${u.tentative ? '<span class="ticket__tent">Tentative</span>' : ""}${i === 0 ? '<span class="ticket__up">Up next</span>' : ""}</span>
              <span class="ticket__event">${esc(u.event)}</span>
              <span class="ticket__loc">${u.location ? esc(u.location) : "Location to be announced"}</span>
              ${u.goal ? `<span class="hand ticket__goal">goal: ${esc(u.goal)}</span>` : ""}
            </span>
          </li>`
        )
        .join("")
    : `<li class="ticket ticket--empty">New races coming soon. Follow along on Instagram.</li>`;

  /* ---------- Partner ---------- */
  $("audience-summary").textContent = a.audience?.summary || "";
  $("audience").innerHTML = (a.audience?.platforms || [])
    .map((p) => {
      const inner = `<span class="aud__metric">${esc(p.metric)}</span><span class="aud__label">${esc(p.label)}</span><span class="aud__handle">${esc(p.name)} &middot; ${esc(p.handle)}</span>`;
      return `<li class="aud">${p.url ? `<a ${ext(p.url)}>${inner}</a>` : inner}</li>`;
    })
    .join("");

  const icons = [
    '<path d="M12 3v18M5 8l7-5 7 5M6 21h12"/>',
    '<circle cx="12" cy="12" r="4"/><path d="M3 12h3M18 12h3M12 3v3M12 18v3"/>',
    '<path d="M4 20c4-1 6-5 8-9s5-7 8-7M14 4h6v6"/>',
    '<path d="M4 7h16v12H4zM9 7V4h6v3"/>',
    '<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M2 20c1-4 4-5 6-5s5 1 6 5M12 20c1-3 2-5 4-5s5 1 6 5"/>',
  ];
  $("values").innerHTML = (a.sponsorValue || [])
    .map(
      (v, i) => `<li class="value">
        <svg class="value__icon" viewBox="0 0 24 24" aria-hidden="true">${icons[i % icons.length]}</svg>
        <h4>${esc(v.title)}</h4>
        <p>${esc(v.text)}</p>
      </li>`
    )
    .join("");

  $("proof").innerHTML = (a.partners || [])
    .map(
      (p) => `<a class="proof__card" ${ext(p.url || a.sponsorshipReelUrl)}>
        <span class="proof__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>
        <span class="proof__copy">
          <span class="proof__kicker">Recent partnership</span>
          <span class="proof__name">${esc(p.name)}</span>
          <span class="proof__meta">${esc(p.category)} &middot; ${esc(p.date)}</span>
        </span>
        <span class="proof__cta">Watch the reel <span aria-hidden="true">&rarr;</span></span>
      </a>`
    )
    .join("");

  $("tiers").innerHTML = (a.partnershipTiers || [])
    .map(
      (t) => `<li class="tier${t.featured ? " tier--featured" : ""}">
        ${t.featured ? '<span class="tier__flag">Recommended</span>' : ""}
        <h4 class="tier__name">${esc(t.name)}</h4>
        <p class="tier__blurb">${esc(t.blurb)}</p>
        <ul class="tier__perks">${t.perks.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        <a class="btn ${t.featured ? "btn--cream" : "btn--ghost"} btn--block" href="#contact">Start a conversation</a>
      </li>`
    )
    .join("");

  /* ---------- Founder ---------- */
  if (a.website) {
    $("founder-title").innerHTML = `Between races, ${esc(first)} builds brands at <em>JME Labs.</em>`;
    $("founder-blurb").textContent = a.website.blurb;
    $("website-link").href = a.website.url;
    $("website-link").innerHTML = `${esc(a.website.label)} <span aria-hidden="true">&nearr;</span>`;
  }

  /* ---------- Contact ---------- */
  $("contact-photo").innerHTML = img(a.heroImage, `${a.name} portrait`, "50% 20%");
  $("contact-email").href = `mailto:${a.contact.email}`;
  $("contact-email").textContent = a.contact.email;
  $("contact-ig").href = a.contact.instagram;
  $("contact-ig").textContent = `Instagram ${handle}`;
})();
