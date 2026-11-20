(function () {
  const a = window.ATHLETE;
  if (!a) return;

  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = a.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const fmtDate = (iso, opts = { month: "short", day: "numeric", year: "numeric" }) =>
    new Date(iso + "T12:00:00").toLocaleDateString("en-US", opts);
  const seriesClass = (s) => (s === "DEKA" ? "tag--deka" : "tag--hyrox");

  // Renders an <img>; if the file is missing, swaps in a styled placeholder.
  function image(container, src, alt, label) {
    const placeholder = () => {
      container.classList.add("placeholder");
      container.innerHTML = `<span>${esc(label || initials)}</span>`;
    };
    if (!src) return placeholder();
    // Attach the <img> right away: Safari never loads a lazy image that isn't in the DOM.
    const img = new Image();
    img.alt = alt || "";
    img.loading = "lazy";
    img.onerror = placeholder;
    img.src = /^(https?:)?\/\//.test(src) ? src : "../" + src;
    container.innerHTML = "";
    container.appendChild(img);
  }

  // Meta & names
  document.title = `${a.name} | Hybrid Racing Athlete`;
  if (a.draft) $("draft-banner").hidden = false;
  $("nav-name").textContent = a.name;
  $("hero-name").textContent = a.name;
  $("hero-tagline").textContent = a.tagline;
  $("hero-disciplines").textContent = [a.disciplines.join(" · "), a.location].filter(Boolean).join("  |  ");
  ["about-first", "partner-first", "contact-first"].forEach((id) => ($(id).textContent = a.firstName));
  $("footer-name").textContent = a.name;
  $("year").textContent = new Date().getFullYear();

  image($("hero-media"), a.heroImage, a.name, " ");
  image($("portrait"), a.portrait, a.name);

  // Stats
  $("stats").innerHTML = a.stats
    .map((s) => `<div class="stat"><div class="stat__value">${esc(s.value)}</div><div class="stat__label">${esc(s.label)}</div></div>`)
    .join("");

  // Bio & highlights
  $("bio").innerHTML = a.bio.map((p) => `<p>${esc(p)}</p>`).join("");
  $("highlights").innerHTML = (a.highlights || []).map((h) => `<li>${esc(h)}</li>`).join("");

  // Personal bests (from results flagged pb: true)
  $("pbs").innerHTML = a.results
    .filter((r) => r.pb)
    .map(
      (r) => `<div class="pb">
        <span class="tag ${seriesClass(r.series)}">${esc(r.series)}</span>
        <div class="pb__time">${esc(r.time)}</div>
        <div class="pb__format">${esc(r.format)}</div>
        <div class="muted pb__event">${esc(r.event)} · ${esc(fmtDate(r.date, { month: "short", year: "numeric" }))}</div>
      </div>`
    )
    .join("");

  // Results (newest first) with series filter
  const results = [...a.results].sort((x, y) => y.date.localeCompare(x.date));
  function renderResults(filter) {
    const rows = results.filter((r) => filter === "all" || r.series === filter);
    $("results-body").innerHTML = rows.length
      ? rows
          .map(
            (r) => `<tr>
              <td data-label="Date">${esc(fmtDate(r.date))}</td>
              <td data-label="Event">
                <span class="tag ${seriesClass(r.series)}">${esc(r.series)}</span> ${esc(r.event)}
                ${r.partners ? `<div class="partners">with ${esc(r.partners)}</div>` : ""}
              </td>
              <td data-label="Division">${esc(r.format)}</td>
              <td data-label="Time" class="mono">${esc(r.time)}${r.pb ? ` <span class="pb-badge">PB</span>` : ""}</td>
              <td data-label="Place"><strong>${r.place != null ? "#" + Number(r.place).toLocaleString("en-US") : ""}</strong></td>
            </tr>`
          )
          .join("")
      : `<tr><td colspan="5" class="empty">${filter === "all" ? "No results yet." : `${esc(filter)} results coming soon.`}</td></tr>`;
  }
  document.querySelectorAll(".filter").forEach((btn) =>
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderResults(btn.dataset.filter);
    })
  );
  renderResults("all");

  // Upcoming races (future only, soonest first)
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = a.upcoming.filter((r) => r.date >= today).sort((x, y) => x.date.localeCompare(y.date));
  $("schedule-list").innerHTML = upcoming.length
    ? upcoming
        .map(
          (r) => `<article class="race">
            <div class="race__date">
              <span class="race__month">${esc(fmtDate(r.date, { month: "short" }))}</span>
              <span class="race__day">${esc(fmtDate(r.date, { day: "numeric" }))}</span>
              <span class="race__year">${esc(fmtDate(r.date, { year: "numeric" }))}</span>
            </div>
            <div class="race__body">
              <span class="tag ${seriesClass(r.series)}">${esc(r.series)}</span>${r.tentative ? `<span class="tag tag--tentative">Tentative</span>` : ""}
              <h3>${esc(r.event)}</h3>
              ${r.location ? `<p class="muted">${esc(r.location)}</p>` : ""}
              ${r.goal ? `<p class="race__goal">Goal: ${esc(r.goal)}</p>` : ""}
            </div>
          </article>`
        )
        .join("")
    : `<p class="muted">Next season's schedule is coming soon.</p>`;

  // Gallery
  const gallery = $("gallery");
  a.gallery.forEach((g) => {
    const tile = document.createElement("figure");
    tile.className = "gallery__item";
    gallery.appendChild(tile);
    image(tile, g.src, g.alt, g.alt);
    if (g.position) tile.style.setProperty("--pos", g.position);
  });
  document.querySelectorAll(".js-highlights").forEach((el) => {
    if (a.highlightsUrl) el.href = a.highlightsUrl;
    else el.remove();
  });

  // Partner section
  $("audience-summary").textContent = a.audience.summary;
  $("reach").innerHTML = a.audience.platforms
    .map((p) => {
      const inner = `<div class="reach__metric">${esc(p.metric)}</div><div class="reach__label">${esc(p.label)}</div><div class="reach__name">${esc(p.name)} · ${esc(p.handle)}</div>`;
      return p.url
        ? `<a class="reach__card" href="${esc(p.url)}" target="_blank" rel="noopener">${inner}</a>`
        : `<div class="reach__card">${inner}</div>`;
    })
    .join("");
  $("value").innerHTML = a.sponsorValue
    .map((v, i) => `<article class="value"><span class="value__num">0${i + 1}</span><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></article>`)
    .join("");
  $("tiers").innerHTML = a.partnershipTiers
    .map(
      (t) => `<article class="tier${t.featured ? " tier--featured" : ""}">
        ${t.featured ? `<span class="tier__badge">Recommended</span>` : ""}
        <h4>${esc(t.name)}</h4>
        <p class="muted">${esc(t.blurb)}</p>
        <ul>${t.perks.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        <a href="#contact" class="btn ${t.featured ? "" : "btn--ghost"} btn--block">Inquire</a>
      </article>`
    )
    .join("");

  // Interview pull quote
  if (a.interview) {
    const iv = a.interview;
    $("interview").hidden = false;
    $("quote-text").textContent = `“${iv.quote}”`;
    $("quote-source").textContent = [iv.title, iv.subtitle, iv.date].filter(Boolean).join(" · ");
    $("quote-link").href = iv.url;
  }

  // Business website & sponsorship reel
  if (a.website) {
    $("website-link").href = a.website.url;
    $("website-link").innerHTML = `<span class="muted">${esc(a.website.blurb)}</span> <strong>${esc(a.website.label)} ↗</strong>`;
  } else $("website-link").remove();
  if (a.sponsorshipReelUrl) $("reel-link").href = a.sponsorshipReelUrl;
  else $("reel-link").remove();

  // Contact
  const subject = encodeURIComponent(`Sponsorship inquiry: ${a.name}`);
  $("contact-email").href = `mailto:${a.contact.email}?subject=${subject}`;
  if (a.contact.instagram) $("contact-ig").href = a.contact.instagram;
  else $("contact-ig").remove();
})();
