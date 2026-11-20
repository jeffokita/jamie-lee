(function () {
  "use strict";
  const A = window.ATHLETE;
  if (!A) return;

  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const day = (iso) => new Date(iso + "T12:00:00");
  const fmt = (iso, o) => day(iso).toLocaleDateString("en-US", o || { month: "short", day: "numeric", year: "numeric" });
  const ext = (url, label, cls) =>
    `<a href="${esc(url)}" target="_blank" rel="noopener"${cls ? ` class="${cls}"` : ""}>${label}</a>`;
  const toSec = (t) => String(t).split(":").map(Number).reduce((a, n) => a * 60 + n, 0);
  const pad = (n) => String(n).padStart(2, "0");
  const fromSec = (s, withHours) => {
    s = Math.max(0, Math.round(s));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return withHours || h ? `${h}:${pad(m)}:${pad(x)}` : `${m}:${pad(x)}`;
  };
  const ord = (n) => {
    const v = n % 100;
    return n + (["th", "st", "nd", "rd"][(v - 20) % 10] || ["th", "st", "nd", "rd"][v] || "th");
  };
  const img = (src) => (/^(https?:)?\/\//.test(src) ? src : "../" + src);

  /* ---------- basics ---------- */
  document.title = `${A.name} | Race Data & Sponsorship`;
  if (A.draft) $("draft-banner").hidden = false;
  const disc = A.disciplines.join(" · ");
  $("nav-name").textContent = A.name;
  $("hero-name").innerHTML = A.name.split(/\s+/).map((w) => `<span>${esc(w)}</span>`).join("");
  $("hero-tagline").textContent = A.tagline;
  $("hero-disc").textContent = [disc, A.location].filter(Boolean).join("  //  ");
  document.querySelectorAll(".js-first").forEach((el) => (el.textContent = A.firstName));
  $("foot-name").textContent = A.name;
  $("foot-disc").textContent = disc;
  $("year").textContent = new Date().getFullYear();

  function photo(container, src, alt, position) {
    if (!src) { container.classList.add("ph"); return; }
    const i = new Image();
    i.alt = alt || "";
    i.decoding = "async";
    if (position) i.style.objectPosition = position;
    i.onerror = () => { i.remove(); container.classList.add("ph"); };
    i.src = img(src);
    container.prepend(i);
  }
  photo($("hero-media"), A.heroImage, `${A.name} leaning on a barbell in a squat rack`);
  photo($("portrait"), A.portrait, `${A.name} on a rowing machine in her home gym`);

  /* ---------- hero clock: Women PB ---------- */
  const womenPB =
    A.results.find((r) => r.pb && r.format === "Women") ||
    A.results.filter((r) => r.pb).sort((a, b) => toSec(a.time) - toSec(b.time))[0];
  if (womenPB) {
    $("clock-div").textContent = `${womenPB.series} ${womenPB.format}`.toUpperCase();
    $("clock-time").innerHTML = `<span data-count="${esc(womenPB.time)}">${esc(womenPB.time)}</span>`;
    $("clock-foot").textContent = `${womenPB.event.replace(/^HYROX\s+/, "")} · ${fmt(womenPB.date, { month: "short", year: "numeric" })} · POS ${womenPB.place}`.toUpperCase();
  } else $("hero-clock").hidden = true;

  /* ---------- stat board ---------- */
  $("stats").innerHTML = A.stats
    .map(
      (s, i) => `<div class="cell">
        <dt class="cell__label mono"><span class="cell__idx">${pad(i + 1)}</span>${esc(s.label)}</dt>
        <dd class="cell__value"><span data-count="${esc(s.value)}">${esc(s.value)}</span></dd>
      </div>`
    )
    .join("");

  /* ---------- ticker ---------- */
  const tick = (A.highlights || []).map((h) => `<span class="ticker__item">${esc(h)}</span>`).join("");
  $("ticker").innerHTML = `<div class="ticker__run">${tick}</div><div class="ticker__run" aria-hidden="true">${tick}</div>`;

  /* ---------- bio ---------- */
  $("bio").innerHTML = A.bio.map((p) => `<p>${esc(p)}</p>`).join("");
  $("highlights").innerHTML = (A.highlights || [])
    .map((h, i) => `<li><span class="log__lap mono">L${pad(i + 1)}</span><span>${esc(h)}</span></li>`)
    .join("");
  if (A.website) {
    $("website").innerHTML = `<span class="mono site-card__k">OFF COURSE</span>
      <p>${esc(A.website.blurb)}</p>
      ${ext(A.website.url, `${esc(A.website.label)} ↗`, "site-card__link")}`;
  }

  /* ---------- interview ---------- */
  const iv = A.interview;
  if (iv) {
    $("interview").innerHTML = `<p class="quote__mark mono" aria-hidden="true">// RADIO CHECK</p>
      <blockquote><p>“${esc(iv.quote)}”</p></blockquote>
      <p class="quote__src mono">${esc(iv.title)} · ${esc(iv.subtitle)} · ${esc(iv.date)}</p>
      ${ext(iv.url, "Read the feature interview ↗", "btn btn--ghost")}`;
  }

  /* ---------- progression chart (HYROX Women, solo) ---------- */
  const series = A.results
    .filter((r) => r.series === "HYROX" && r.format === "Women")
    .map((r) => ({ r, d: day(r.date), s: toSec(r.time) }))
    .sort((a, b) => a.d - b.d);

  if (series.length > 1) {
    const first = series[0];
    const best = series.reduce((b, p) => (p.s < b.s ? p : b), series[0]);
    const drop = first.s - best.s;
    const months = Math.round((best.d - first.d) / (1000 * 60 * 60 * 24 * 30.44));
    const pct = ((drop / first.s) * 100).toFixed(1);
    $("chart-intro").textContent =
      `Solo HYROX Women division, all ${series.length} races. Lower is faster, so the chart is flipped: up means a quicker finish.`;
    $("chart-kpis").innerHTML = `
      <div class="kpi"><span class="kpi__k mono">FIRST</span><span class="kpi__v mono">${esc(first.r.time)}</span><span class="kpi__s">${esc(fmt(first.r.date, { month: "short", year: "numeric" }))}</span></div>
      <div class="kpi kpi--arrow" aria-hidden="true">→</div>
      <div class="kpi"><span class="kpi__k mono">PB</span><span class="kpi__v mono kpi__v--hi">${esc(best.r.time)}</span><span class="kpi__s">${esc(fmt(best.r.date, { month: "short", year: "numeric" }))}</span></div>
      <div class="kpi kpi--delta"><span class="kpi__k mono">TIME CUT</span><span class="kpi__v mono">−<span data-count="${fromSec(drop)}">${fromSec(drop)}</span></span><span class="kpi__s">${pct}% faster in ${months} months</span></div>`;
    $("chart-table").innerHTML =
      `<caption class="sr-only">HYROX Women finish times</caption><thead><tr><th scope="col">Date</th><th scope="col">Event</th><th scope="col" class="num">Time</th><th scope="col" class="num">Pos</th></tr></thead><tbody>` +
      series
        .map((p) => `<tr><td class="mono">${esc(fmt(p.r.date))}</td><td>${esc(p.r.event)}</td><td class="num mono">${esc(p.r.time)}${p.r.pb ? ' <span class="pb-flag">PB</span>' : ""}</td><td class="num mono">${p.r.place}</td></tr>`)
        .join("") +
      `</tbody>`;

    const host = $("chart");
    const tip = $("chart-tip");
    let drawn = false;

    const draw = () => {
      const W = host.clientWidth;
      const small = W < 640;
      const H = small ? 300 : 400;
      const m = { t: 36, r: small ? 20 : 132, b: 40, l: small ? 52 : 64 };
      const pw = W - m.l - m.r, ph = H - m.t - m.b;
      const step = small ? 240 : 120;
      const lo = Math.floor((best.s - 60) / step) * step;
      const hi = Math.ceil((Math.max(...series.map((p) => p.s)) + 60) / step) * step;
      const pad45 = 45 * 864e5;
      const x0 = +series[0].d - pad45, x1 = +series[series.length - 1].d + pad45;
      const X = (d) => m.l + ((+d - x0) / (x1 - x0)) * pw;
      const Y = (s) => m.t + ((s - lo) / (hi - lo)) * ph; // faster (lower) times plot higher

      let g = "";
      for (let s = lo; s <= hi; s += step) {
        g += `<line class="grid" x1="${m.l}" x2="${m.l + pw}" y1="${Y(s)}" y2="${Y(s)}"/>
              <text class="tick" x="${m.l - 10}" y="${Y(s) + 4}" text-anchor="end">${fromSec(s, true).slice(0, -3)}</text>`;
      }
      const y0 = new Date(x0).getFullYear(), y1 = new Date(x1).getFullYear();
      for (let y = y0; y <= y1; y++) {
        const t = new Date(y, 0, 1);
        if (+t < x0 || +t > x1) continue;
        g += `<line class="xtick" x1="${X(t)}" x2="${X(t)}" y1="${m.t + ph}" y2="${m.t + ph + 6}"/>
              <text class="tick" x="${X(t)}" y="${m.t + ph + 24}" text-anchor="middle">${y}</text>`;
      }
      const path = series.map((p, i) => `${i ? "L" : "M"}${X(p.d).toFixed(1)},${Y(p.s).toFixed(1)}`).join("");
      const dots = series
        .map((p, i) => `<circle class="dot${p === best ? " dot--pb" : ""}" cx="${X(p.d)}" cy="${Y(p.s)}" r="${p === best ? 7 : 5}" data-i="${i}" tabindex="0" aria-label="${esc(`${p.r.event}, ${fmt(p.r.date)}: ${p.r.time}, position ${p.r.place}`)}"/>`)
        .join("");

      // Direct labels: first race and PB only
      const fx = X(first.d), fy = Y(first.s), bx = X(best.d), by = Y(best.s);
      const labels = `
        <text class="dlabel dlabel--sub" x="${fx - 6}" y="${fy - 32}">${esc(fmt(first.r.date, { month: "short", year: "numeric" }))}</text>
        <text class="dlabel" x="${fx - 6}" y="${fy - 14}">${esc(first.r.time)}</text>
        <text class="dlabel dlabel--pb" x="${bx}" y="${by - 30}" text-anchor="${small ? "end" : "middle"}">PB ${esc(best.r.time)}</text>
        <text class="dlabel dlabel--sub" x="${bx}" y="${by - 15}" text-anchor="${small ? "end" : "middle"}">${esc(best.r.event.replace(/^HYROX\s+/, ""))} ${day(best.r.date).getFullYear()}</text>`;

      // Delta bracket in right margin (desktop)
      let bracket = "";
      if (!small) {
        const bxr = m.l + pw + 28;
        bracket = `
          <line class="guide" x1="${fx}" x2="${bxr}" y1="${fy}" y2="${fy}"/>
          <line class="guide" x1="${bx}" x2="${bxr}" y1="${by}" y2="${by}"/>
          <line class="bracket" x1="${bxr}" x2="${bxr}" y1="${fy}" y2="${by + 8}"/>
          <path class="bracket-head" d="M${bxr - 6},${by + 10} L${bxr},${by} L${bxr + 6},${by + 10} Z"/>
          <text class="dlabel" x="${bxr + 14}" y="${(fy + by) / 2 - 4}">−${fromSec(drop)}</text>
          <text class="dlabel dlabel--sub" x="${bxr + 14}" y="${(fy + by) / 2 + 13}">faster</text>`;
      }

      host.querySelector("svg")?.remove();
      host.insertAdjacentHTML(
        "afterbegin",
        `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="chart-title chart-desc">
          <title id="chart-title">HYROX Women finish times, ${esc(fmt(first.r.date, { month: "short", year: "numeric" }))} to ${esc(fmt(best.r.date, { month: "short", year: "numeric" }))}</title>
          <desc id="chart-desc">Line chart of ${series.length} solo HYROX Women finishes. Times fall from ${esc(first.r.time)} to a personal best of ${esc(best.r.time)}, ${fromSec(drop)} faster. Full values in the data table below.</desc>
          <text class="axis-t" x="${m.l}" y="${m.t - 16}">▲ FASTER · FINISH TIME (H:MM)</text>
          ${g}
          ${bracket}
          <path class="line${drawn || reduce ? "" : " line--draw"}" d="${path}" pathLength="1"/>
          <line class="cross" id="cross" x1="0" x2="0" y1="${m.t}" y2="${m.t + ph}" visibility="hidden"/>
          ${labels}
          <rect class="hit" x="${m.l}" y="${m.t}" width="${pw}" height="${ph}"/>
          ${dots}
        </svg>`
      );
      const svg = host.querySelector("svg");
      const cross = svg.querySelector("#cross");
      const show = (i) => {
        const p = series[i];
        const cx = X(p.d), cy = Y(p.s);
        cross.setAttribute("x1", cx); cross.setAttribute("x2", cx); cross.setAttribute("visibility", "visible");
        svg.querySelectorAll(".dot").forEach((d) => d.classList.toggle("is-on", +d.dataset.i === i));
        tip.innerHTML = `<b>${esc(p.r.time)}</b>${p.r.pb ? ' <span class="pb-flag">PB</span>' : ""}<br>${esc(p.r.event)}<br><span>${esc(fmt(p.r.date))} · POS ${p.r.place}</span>`;
        tip.hidden = false;
        const tw = tip.offsetWidth;
        tip.style.left = Math.min(Math.max(cx - tw / 2, 4), W - tw - 4) + "px";
        tip.style.top = Math.max(cy - tip.offsetHeight - 16, 0) + "px";
      };
      const hide = () => {
        tip.hidden = true;
        cross.setAttribute("visibility", "hidden");
        svg.querySelectorAll(".dot").forEach((d) => d.classList.remove("is-on"));
      };
      const nearest = (clientX) => {
        const bx0 = svg.getBoundingClientRect().left;
        let bi = 0, bd = Infinity;
        series.forEach((p, i) => { const d = Math.abs(X(p.d) - (clientX - bx0)); if (d < bd) { bd = d; bi = i; } });
        return bi;
      };
      svg.addEventListener("pointermove", (e) => show(nearest(e.clientX)));
      svg.addEventListener("pointerleave", hide);
      svg.querySelectorAll(".dot").forEach((d) => {
        d.addEventListener("focus", () => show(+d.dataset.i));
        d.addEventListener("blur", hide);
      });
    };

    draw();
    let rt;
    let lastW = host.clientWidth;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => { if (host.clientWidth !== lastW) { lastW = host.clientWidth; drawn = true; draw(); } }, 150);
    });
    if (!reduce && "IntersectionObserver" in window) {
      let firstCall = true;
      const io = new IntersectionObserver((es) => {
        const visible = es.some((e) => e.isIntersecting);
        if (visible && firstCall) { host.querySelector(".line--draw")?.classList.remove("line--draw"); drawn = true; io.disconnect(); }
        else if (visible) {
          host.classList.add("is-live"); drawn = true; io.disconnect();
          setTimeout(() => host.querySelector(".line--draw")?.classList.remove("line--draw"), 2000);
        }
        firstCall = false;
      }, { threshold: 0.3 });
      io.observe(host);
    } else host.classList.add("is-live");
  }

  /* ---------- PB split cards ---------- */
  const pbs = A.results.filter((r) => r.pb).sort((a, b) => toSec(a.time) - toSec(b.time));
  $("pbs").innerHTML = pbs
    .map(
      (r, i) => `<article class="split${r === womenPB ? " split--hero" : ""}">
        <header class="split__head mono"><span>SPLIT ${pad(i + 1)}</span><span>${esc(r.series)}</span></header>
        <h3 class="split__div">${esc(r.format)}</h3>
        <p class="split__time mono"><span data-count="${esc(r.time)}">${esc(r.time)}</span></p>
        <dl class="split__meta mono">
          <div><dt>EVENT</dt><dd>${esc(r.event.replace(/^HYROX\s+/, ""))}</dd></div>
          <div><dt>DATE</dt><dd>${esc(fmt(r.date, { month: "short", year: "numeric" }))}</dd></div>
          <div><dt>POS</dt><dd>${esc(ord(r.place))}</dd></div>
        </dl>
        ${r.partners ? `<p class="split__with">w/ ${esc(r.partners)}</p>` : ""}
      </article>`
    )
    .join("");

  /* ---------- results leaderboard ---------- */
  const formats = [...new Set(A.results.map((r) => r.format))];
  const filters = [{ k: "all", label: "All", n: A.results.length }, { k: "pb", label: "PBs", n: pbs.length }].concat(
    formats.map((f) => ({ k: f, label: f, n: A.results.filter((r) => r.format === f).length }))
  );
  $("filters").innerHTML = filters
    .map((f, i) => `<button type="button" class="chip" data-k="${esc(f.k)}" aria-pressed="${i === 0}">${esc(f.label)} <span class="chip__n mono">${f.n}</span></button>`)
    .join("");
  const renderResults = (k) => {
    const rows = A.results.filter((r) => k === "all" || (k === "pb" ? r.pb : r.format === k));
    $("res-count").textContent = `${rows.length} ${rows.length === 1 ? "ENTRY" : "ENTRIES"}`;
    $("results-body").innerHTML = rows
      .map(
        (r) => `<tr class="${r.pb ? "is-pb" : ""}">
          <td class="mono c-date" data-l="Date">${esc(r.date)}</td>
          <td class="c-event" data-l="Event"><span class="ev">${esc(r.event)}</span>${r.partners ? `<span class="with">w/ ${esc(r.partners)}</span>` : ""}</td>
          <td class="c-div" data-l="Division"><span class="divtag">${esc(r.format)}</span></td>
          <td class="num mono c-time" data-l="Time">${esc(r.time)}${r.pb ? ' <span class="pb-flag">PB</span>' : ""}</td>
          <td class="num mono c-pos" data-l="Pos">${esc(r.place)}</td>
        </tr>`
      )
      .join("");
  };
  $("filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    $("filters").querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    renderResults(b.dataset.k);
  });
  renderResults("all");

  /* ---------- upcoming / countdown ---------- */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const up = (A.upcoming || []).filter((u) => new Date(u.date + "T00:00:00") >= today).sort((a, b) => a.date.localeCompare(b.date));
  const tagFor = (s) => `<span class="tag ${s === "DEKA" ? "tag--deka" : "tag--hyrox"}">${esc(s)}</span>`;
  if (!up.length) {
    $("next").hidden = true;
  } else {
    const n = up[0];
    $("countdown").innerHTML = `
      <div class="cd__head mono"><span class="tag tag--live">NEXT HEAT</span>${n.tentative ? '<span class="tag tag--tent">Tentative</span>' : ""}</div>
      <h3 class="cd__event">${esc(n.event)}</h3>
      <p class="cd__meta mono">${esc(fmt(n.date, { weekday: "short", month: "short", day: "numeric", year: "numeric" }).toUpperCase())}${n.location ? " · " + esc(n.location.toUpperCase()) : ""}</p>
      <div class="cd" id="cd" role="timer" aria-label="Countdown to race day">
        ${["DAYS", "HRS", "MIN", "SEC"].map((u) => `<div class="cd__unit"><div class="cd__digits" data-u="${u}"></div><span class="cd__u mono">${u}</span></div>`).join("")}
      </div>
      ${n.goal ? `<p class="cd__goal"><span class="mono">TARGET</span> ${esc(n.goal)}</p>` : ""}`;
    const target = new Date(n.date + "T00:00:00");
    const boxes = [...document.querySelectorAll(".cd__digits")];
    const set = (box, str) => {
      if (box.dataset.v === str) return;
      const old = box.dataset.v || "";
      box.dataset.v = str;
      if (box.children.length !== str.length) box.innerHTML = [...str].map(() => '<span class="fd"></span>').join("");
      [...str].forEach((ch, i) => {
        const c = box.children[i];
        if (c.textContent !== ch) {
          c.textContent = ch;
          if (!reduce && old) { c.classList.remove("flip"); void c.offsetWidth; c.classList.add("flip"); }
        }
      });
    };
    const tickCd = () => {
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s %= 86400;
      const vals = [String(d).padStart(2, "0"), pad(Math.floor(s / 3600)), pad(Math.floor((s % 3600) / 60)), pad(s % 60)];
      boxes.forEach((b, i) => set(b, vals[i]));
    };
    tickCd();
    setInterval(tickCd, 1000);

    $("upcoming").innerHTML = up
      .map(
        (u, i) => `<li class="heat${i === 0 ? " heat--next" : ""}">
          <span class="heat__no mono">H${pad(i + 1)}</span>
          <span class="heat__date mono"><b>${esc(fmt(u.date, { month: "short", day: "numeric" }).toUpperCase())}</b>${day(u.date).getFullYear()}</span>
          <span class="heat__main">
            <span class="heat__ev">${esc(u.event)}</span>
            <span class="heat__sub">${[u.location, u.goal ? "Goal: " + u.goal : ""].filter(Boolean).map(esc).join(" · ")}</span>
          </span>
          <span class="heat__tags">${tagFor(u.series)}${u.tentative ? '<span class="tag tag--tent">Tentative</span>' : ""}</span>
        </li>`
      )
      .join("");
  }

  /* ---------- gallery ---------- */
  $("gallery").innerHTML = (A.gallery || [])
    .map((g, i) => `<figure class="shot hud" data-i="${i}"><figcaption class="hud__label mono">CAM ${pad(i + 3)} <span>// ${esc(g.alt.toUpperCase())}</span></figcaption></figure>`)
    .join("");
  (A.gallery || []).forEach((g, i) => photo(document.querySelector(`.shot[data-i="${i}"]`), g.src, g.alt, g.position));
  if (A.highlightsUrl) $("ig-highlights").href = A.highlightsUrl;
  else $("ig-highlights").hidden = true;

  /* ---------- audience ---------- */
  const au = A.audience || {};
  $("audience-summary").textContent = au.summary || "";
  $("audience").innerHTML = (au.platforms || [])
    .map(
      (p) => `<div class="reach__cell">
        <dt class="mono">${esc(p.name.toUpperCase())} <span>${esc(p.handle)}</span></dt>
        <dd class="reach__v"><span data-count="${esc(p.metric)}">${esc(p.metric)}</span></dd>
        <dd class="reach__l">${p.url ? ext(p.url, esc(p.label) + " ↗") : esc(p.label)}</dd>
      </div>`
    )
    .join("");
  const partner = (A.partners || [])[0];
  $("proof").innerHTML =
    (partner
      ? `<span class="mono proof__k">PROOF OF PARTNERSHIP</span>
         <p class="proof__name">${esc(partner.name)}</p>
         <p class="proof__meta mono">${esc(partner.category.toUpperCase())} · ${esc(partner.date.toUpperCase())}</p>
         ${ext(partner.url || A.sponsorshipReelUrl, `Watch the ${esc(partner.name)} reel ↗`, "btn btn--sm")}`
      : "") +
    (A.instagramBio ? `<p class="proof__bio"><span class="mono">IG BIO</span> “${esc(A.instagramBio)}”</p>` : "");

  $("value").innerHTML = (A.sponsorValue || [])
    .map((v, i) => `<li class="prop"><span class="prop__n mono">${pad(i + 1)}</span><h4>${esc(v.title)}</h4><p>${esc(v.text)}</p></li>`)
    .join("");

  $("tiers").innerHTML = (A.partnershipTiers || [])
    .map(
      (t, i) => `<article class="tier${t.featured ? " tier--feat" : ""}">
        <header class="tier__head mono"><span>TIER ${pad(i + 1)}</span>${t.featured ? '<span class="tier__badge">FEATURED</span>' : ""}</header>
        <h4 class="tier__name">${esc(t.name)}</h4>
        <p class="tier__blurb">${esc(t.blurb)}</p>
        <ul class="tier__perks">${t.perks.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        <a href="#contact" class="btn ${t.featured ? "" : "btn--ghost"} btn--block">Enquire</a>
      </article>`
    )
    .join("");

  /* ---------- contact ---------- */
  const c = A.contact || {};
  if (c.email) {
    const em = $("contact-email");
    em.href = `mailto:${c.email}?subject=${encodeURIComponent(`Sponsorship: ${A.name}`)}`;
    em.textContent = c.email;
  }
  $("contact-links").innerHTML = [
    c.instagram ? ext(c.instagram, `Instagram ${esc((au.platforms || [])[0]?.handle || "")} ↗`, "btn btn--ghost") : "",
    A.sponsorshipReelUrl ? ext(A.sponsorshipReelUrl, "Sponsorship reel ↗", "btn btn--ghost") : "",
    A.website ? ext(A.website.url, `${esc(A.website.label)} ↗`, "btn btn--ghost") : "",
  ].join("");

  /* ---------- count-up numbers ---------- */
  function parse(str) {
    let m = String(str).match(/^(\d+):(\d{2}):(\d{2})$/) || String(str).match(/^(\d+):(\d{2})$/);
    if (m) {
      const hrs = m.length === 4;
      return { total: toSec(str), out: (v) => fromSec(v, hrs) };
    }
    m = String(str).match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!m) return null;
    const num = parseFloat(m[2].replace(/,/g, ""));
    const dec = (m[2].split(".")[1] || "").length;
    const commas = m[2].includes(",");
    return {
      total: num,
      out: (v) => {
        let s = v.toFixed(dec);
        if (commas) s = Number(s).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
        return m[1] + s + m[3];
      },
    };
  }
  function run(el) {
    const final = el.dataset.count;
    const p = parse(final);
    if (!p) return;
    const dur = 1400, t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      el.textContent = t < 1 ? p.out(p.total * ease(t)) : final;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    setTimeout(() => (el.textContent = final), dur + 250); // guarantee the final value
  }
  // Final values are already in the DOM; animation is an enhancement only.
  if (!reduce && "IntersectionObserver" in window) {
    // Numbers already on screen at load stay put; only ones scrolled into view count up.
    let first = true;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => { if (e.isIntersecting) { if (!first) run(e.target); io.unobserve(e.target); } });
        first = false;
      },
      { threshold: 0.6 }
    );
    document.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
  }
})();
