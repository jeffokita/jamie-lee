(function () {
  "use strict";
  var a = window.ATHLETE;
  if (!a) return;

  /* ---------- helpers ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var arr = function (x) { return Array.isArray(x) ? x : []; };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var src = function (p) { return !p ? "" : /^(https?:)?\/\//.test(p) ? p : "../" + p; };
  var NEW_TAB = '<span class="sr-only"> (opens in a new tab)</span>';
  var ext = function (url, label, cls) {
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener"' + (cls ? ' class="' + cls + '"' : "") + ">" + label + NEW_TAB + "</a>";
  };
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var parts = function (iso) { var p = String(iso).split("-").map(Number); return { y: p[0], m: (p[1] || 1) - 1, d: p[2] || 1 }; };
  var fmt = function (iso, style) {
    var p = parts(iso);
    if (style === "my") return MONTHS[p.m].slice(0, 3) + " " + p.y;
    if (style === "md") return MONTHS[p.m].slice(0, 3) + " " + p.d;
    return MONTHS[p.m].slice(0, 3) + " " + p.d + ", " + p.y;
  };
  var dayNum = function (iso) { var p = parts(iso); return Date.UTC(p.y, p.m, p.d) / 864e5; };
  var now = new Date();
  var today = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  // Handles "1:21:37", "56:12" and "23:54.7" (tenths)
  var toSec = function (t) {
    return String(t).split(":").map(parseFloat).reduce(function (acc, n) { return acc * 60 + (isNaN(n) ? 0 : n); }, 0);
  };
  var fmtDur = function (s) {
    s = Math.round(Math.abs(s) * 10) / 10;
    var whole = Math.floor(s), tenth = Math.round((s - whole) * 10);
    var h = Math.floor(whole / 3600), m = Math.floor((whole % 3600) / 60), x = whole % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(x).padStart(2, "0") + (tenth ? "." + tenth : "");
  };
  var listJoin = function (xs) {
    xs = xs.filter(Boolean);
    if (xs.length < 3) return xs.join(" and ");
    return xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1];
  };
  function img(p, alt, pos, opts) {
    opts = opts || {};
    if (!p) return "";
    return '<img src="' + esc(src(p)) + '" alt="' + esc(alt || "") + '"' +
      (opts.eager ? ' fetchpriority="high"' : ' loading="lazy"') +
      (pos ? ' style="object-position:' + esc(pos) + '"' : "") + ">";
  }
  // Missing image -> styled placeholder (capture phase; error events don't bubble)
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && t.parentNode) {
      t.parentNode.classList.add("ph");
      t.remove();
    }
  }, true);

  var first = a.firstName || (a.name || "").split(" ")[0];
  var disciplines = arr(a.disciplines);
  var highlights = arr(a.highlights);
  var gallery = arr(a.gallery);

  /* ---------- meta ---------- */
  document.title = a.name + " | Hybrid Racing Athlete";
  if (a.draft) $("draft-banner").hidden = false;
  $("nav-name").textContent = a.name;
  $("nav-cta").textContent = "Partner with " + first;
  $("hero-cta").textContent = "Partner with " + first;
  $("partner-first").textContent = first + ".";
  $("foot-name").textContent = a.name;
  $("foot-meta").innerHTML = esc([a.category, disciplines.join(" · "), a.location].filter(Boolean).join("  /  ")) +
    " &middot; &copy; " + now.getFullYear();

  /* ---------- 1. hero ---------- */
  $("hero-name").textContent = a.name;
  $("hero-category").textContent = a.category || "";
  var bio = a.instagramBio || a.tagline || a.name;
  var m = bio.match(/^(.*?\bbetween\b)\s+(.*)$/i);
  $("hero-title").innerHTML = m
    ? '<span class="hero__t1">' + esc(m[1]) + '</span> <span class="hero__t2">' + esc(m[2]) + "</span>"
    : esc(bio);
  $("hero-disc").innerHTML = disciplines.map(function (d) { return "<span>" + esc(d) + "</span>"; }).join("");
  $("hero-lede").textContent = a.tagline || "";
  $("hero-photo").innerHTML = img(a.heroImage, a.name + " leaning on a barbell in a squat rack", "50% 22%", { eager: true });

  var upcoming = arr(a.upcoming).filter(function (u) { return u && u.date >= today; })
    .sort(function (x, y) { return x.date < y.date ? -1 : 1; });
  var next = upcoming[0];
  if (next) {
    var days = Math.round(dayNum(next.date) - dayNum(today));
    $("startline").hidden = false;
    $("startline-date").innerHTML = "<strong>" + esc(fmt(next.date)) + "</strong>" +
      (days === 0 ? " · Race day" : days > 0 ? " · " + days + (days === 1 ? " day" : " days") + " out" : "");
    $("startline-event").textContent = next.event;
    var evs = arr(next.events);
    $("startline-meta").innerHTML = [
      next.location ? esc(next.location) : "",
      evs.length ? esc(evs.length + (evs.length === 1 ? " event" : " events")) : "",
      next.tentative ? "Tentative" : "",
    ].filter(Boolean).join('<span class="dot" aria-hidden="true"> · </span>') +
      (next.goal ? '<span class="startline__goal">Goal: <strong>' + esc(next.goal) + "</strong></span>" : "");
  }

  /* ---------- 2. ticker ---------- */
  if (highlights.length) {
    var tick = highlights.map(function (h) { return '<li class="ticker__item">' + esc(h) + "</li>"; }).join("");
    $("ticker").innerHTML = '<ul class="ticker__run">' + tick + '</ul><ul class="ticker__run" aria-hidden="true">' + tick + "</ul>";
    $("ticker-wrap").hidden = false;
  }

  /* ---------- 3. stats ---------- */
  var stats = arr(a.stats).slice();
  if (typeof a.podiums === "number") stats.push({ value: String(a.podiums), label: "Podium finishes" });
  if (typeof a.topFiveFinishes === "number") stats.push({ value: String(a.topFiveFinishes), label: "Top-five finishes" });
  $("stats").innerHTML = stats.map(function (s) {
    return '<div class="stat reveal"><dt class="stat__label">' + esc(s.label) + '</dt><dd class="stat__value">' + esc(s.value) + "</dd></div>";
  }).join("");
  $("stats").style.setProperty("--n", Math.min(stats.length, 6));

  /* ---------- 4. athlete · mom · founder ---------- */
  var recent = highlights.filter(function (h) { return /2026|2027|ATHX|Pro/.test(h) && !/20(1\d|2[0-5])/.test(h); }).slice(0, 4);
  var site = a.website || null;
  var blurb = site && site.blurb ? site.blurb : "";
  var company = blurb.indexOf(":") > 0 ? blurb.split(":")[0].trim() : "";
  var companyLine = blurb.indexOf(":") > 0 ? blurb.slice(blurb.indexOf(":") + 1).trim() : blurb;
  var portraitAlt = first + " on the rower in her home gym";
  var athleteImg = gallery.filter(function (g) { return /deka|airbike/i.test(g.src); })[0] || gallery[1] || gallery[0];

  var ids = [
    {
      key: "athlete", word: "Burpees", label: "Athlete",
      media: athleteImg ? img(athleteImg.src, athleteImg.alt, athleteImg.position) : "",
      lede: disciplines.length ? "Racing " + listJoin(disciplines) + (a.trainsWith ? ", training with " + a.trainsWith + "." : ".") : "",
      kicker: recent.length ? "Her 2026" : "",
      points: recent,
    },
    {
      key: "mom", word: "Bedtime stories", label: "Mom",
      media: img(a.portrait, portraitAlt, "50% 28%"),
      lede: "Most of her podium finishes have come since becoming a mom.",
      points: ["Went all in on hybrid racing postpartum", "Trains mostly in her home gym"],
    },
    {
      key: "founder", word: "Boarding passes", label: "Founder",
      media: '<div class="id__mark"><span class="id__mark-k">Founder</span><span class="id__mark-n">' + esc(company || a.name) +
        '</span><span class="id__mark-s">' + esc(companyLine) + "</span></div>",
      lede: a.positioning || "",
      points: [],
      link: site && site.url ? ext(site.url, "Visit " + esc(site.label || site.url) + ' <span aria-hidden="true">↗</span>', "link") : "",
    },
  ];
  $("ids").innerHTML = ids.map(function (c, i) {
    return '<article class="id id--' + c.key + ' reveal" style="--d:' + i * 90 + 'ms">' +
      '<div class="id__media">' + c.media + '<span class="id__word">' + esc(c.word) + "</span></div>" +
      '<div class="id__body">' +
        '<h3 class="id__label"><span class="id__num">0' + (i + 1) + "</span>" + esc(c.label) + "</h3>" +
        (c.lede ? '<p class="id__lede">' + esc(c.lede) + "</p>" : "") +
        (c.kicker && c.points.length ? '<p class="id__kicker">' + esc(c.kicker) + "</p>" : "") +
        (c.points.length ? '<ul class="id__points">' + c.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" : "") +
        (c.link || "") +
      "</div></article>";
  }).join("");

  /* ---------- 5. story ---------- */
  var storyImg = gallery[0] || (a.portrait ? { src: a.portrait, alt: portraitAlt } : null);
  if (storyImg) $("story-photo").innerHTML = img(storyImg.src, storyImg.alt, storyImg.position);
  else $("story-photo").remove();
  var story = arr(a.story);
  $("timeline").innerHTML = story.map(function (c, i) {
    var isYear = /^\d{4}$/.test(String(c.year).trim());
    var isNext = i === story.length - 1 && isYear && Number(c.year) > now.getFullYear();
    return '<li class="ch reveal' + (isNext ? " ch--next" : "") + '">' +
      '<p class="ch__year' + (isYear ? "" : " ch__year--text") + '">' + esc(c.year) + "</p>" +
      '<div class="ch__body">' +
        (isNext ? '<p class="ch__flag">Next chapter</p>' : '<p class="ch__flag">Chapter ' + (i + 1) + "</p>") +
        '<h3 class="ch__title">' + esc(c.title) + "</h3>" +
        '<p class="ch__text">' + esc(c.text) + "</p>" +
      "</div></li>";
  }).join("");
  if (!story.length) $("story").hidden = true;

  /* ---------- 6. interview ---------- */
  var iv = a.interview;
  if (iv && iv.quote) {
    $("interview").hidden = false;
    $("quote-text").innerHTML = "<p>" + esc(iv.quote) + "</p>";
    $("quote-src").innerHTML = '<span class="radio__who">' + esc(a.name) + "</span>" +
      (iv.title ? ' in <cite>' + esc(iv.title) + "</cite>" : "") +
      (iv.subtitle ? '<span class="radio__sub">' + esc(iv.subtitle) + (iv.date ? " · " + esc(iv.date) : "") + "</span>" : "");
    if (iv.url) $("quote-link").href = iv.url;
    else $("quote-link").remove();
  }

  /* ---------- 7. performance ---------- */
  function chart(entries, id) {
    var pts = entries.map(function (e) { return { d: dayNum(e.date), s: toSec(e.time), e: e }; });
    var W = 640, H = 250, L = 52, R = 18, T = 26, B = 36;
    var d0 = pts[0].d, d1 = pts[pts.length - 1].d;
    var sMin = Math.min.apply(null, pts.map(function (p) { return p.s; }));
    var sMax = Math.max.apply(null, pts.map(function (p) { return p.s; }));
    var span = Math.max(sMax - sMin, 20);
    var step = span > 1500 ? 600 : span > 600 ? 300 : span > 240 ? 120 : span > 90 ? 60 : span > 40 ? 30 : 15;
    var lo = Math.floor((sMin - span * 0.15) / step) * step;
    var hi = Math.ceil((sMax + span * 0.12) / step) * step;
    var x = function (d) { return L + (d1 === d0 ? 0.5 : (d - d0) / (d1 - d0)) * (W - L - R); };
    // Normal axis: larger (slower) times sit higher, so getting faster reads down and to the right.
    var y = function (s) { return T + ((hi - s) / (hi - lo)) * (H - T - B); };
    var g = "";
    for (var t = lo; t <= hi; t += step) {
      g += '<line class="c-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(t) + '" y2="' + y(t) + '"/>' +
        '<text class="c-ax" x="' + (L - 10) + '" y="' + (y(t) + 4) + '" text-anchor="end">' + (t >= 3600 ? fmtDur(t).replace(/:00$/, "") : fmtDur(t)) + "</text>";
    }
    var y0 = parts(entries[0].date).y, y1 = parts(entries[entries.length - 1].date).y;
    for (var yr = y0; yr <= y1 + 1; yr++) {
      var dd = Date.UTC(yr, 0, 1) / 864e5;
      if (dd < d0 - 1 || dd > d1 + 1) continue;
      g += '<line class="c-yr" x1="' + x(dd) + '" x2="' + x(dd) + '" y1="' + T + '" y2="' + (H - B) + '"/>' +
        '<text class="c-ax" x="' + x(dd) + '" y="' + (H - B + 22) + '" text-anchor="middle">' + yr + "</text>";
    }
    var path = "M" + x(pts[0].d) + "," + y(pts[0].s);
    var area = path;
    for (var i = 1; i < pts.length; i++) path += " H" + x(pts[i].d) + " V" + y(pts[i].s);
    area = path + " V" + (H - B) + " H" + x(pts[0].d) + " Z";
    var dots = pts.map(function (p, i) {
      var last = i === pts.length - 1, firstPt = i === 0;
      var lbl = "";
      if (firstPt || last) {
        var anchor = firstPt ? "start" : "end";
        var ly = firstPt ? y(p.s) - 12 : y(p.s) + 8;
        var lx = firstPt ? x(p.d) : x(p.d) - 14;
        lbl = '<text class="c-lbl' + (last ? " c-lbl--pb" : "") + '" x="' + lx + '" y="' + ly + '" text-anchor="' + anchor + '">' + esc(p.e.time) + "</text>";
      }
      return '<circle class="c-dot' + (last ? " c-dot--pb" : "") + '" cx="' + x(p.d) + '" cy="' + y(p.s) + '" r="' + (last ? 7 : 4.5) + '"/>' + lbl;
    }).join("");
    return '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-labelledby="' + id + '-t"><title id="' + id + '-t">' +
      esc("Personal best progression: " + entries.map(function (e) { return e.time + " (" + fmt(e.date, "my") + ")"; }).join(", ")) +
      "</title>" + g + '<path class="c-area" d="' + area + '"/><path class="c-line" d="' + path + '"/>' + dots + "</svg>";
  }

  var progs = arr(a.pbProgressions).filter(function (p) { return p && arr(p.entries).length; }).map(function (p) {
    var es = arr(p.entries).slice().sort(function (x, y) { return x.date < y.date ? -1 : 1; });
    var best = es.reduce(function (b, e) { return toSec(e.time) < toSec(b.time) ? e : b; }, es[0]);
    return { p: p, es: es, f: es[0], best: best };
  });
  // PB board: every track's current personal best (single-entry tracks live here only)
  var board = progs.map(function (t) {
    var b = t.best;
    return '<li class="pbt reveal"><p class="pbt__head"><span class="tag">' + esc(t.p.event) + "</span>" +
      (b.percentile ? '<span class="pct">' + esc(b.percentile) + "</span>" : "") + "</p>" +
      '<h3 class="pbt__format">' + esc(String(t.p.format || "").replace(/^DEKA\s+(?=DEKA)/, "")) + "</h3>" +
      '<p class="pbt__time"><span class="sr-only">Personal best: </span>' + esc(b.time) + "</p>" +
      '<p class="pbt__where">' + esc(b.race) + " · " + esc(fmt(b.date, "my")) + "</p>" +
      (b.note ? '<p class="pb__badge">' + esc(b.note) + "</p>" : "") + "</li>";
  }).join("");
  var multi = progs.filter(function (t) { return t.es.length > 1; });
  var prog = multi.map(function (t, idx) {
    var p = t.p, es = t.es, f = t.f, best = t.best;
    var cut = toSec(f.time) - toSec(best.time);
    var months = Math.round((dayNum(best.date) - dayNum(f.date)) / 30.44);
    var prs = es.length - 1;
    var steps = es.map(function (e, i) {
      var delta = i ? toSec(es[i - 1].time) - toSec(e.time) : 0;
      return "<li" + (e === best ? ' class="is-pb"' : "") + '><span class="st__date">' + esc(fmt(e.date, "my")) + '</span><span class="st__race">' + esc(e.race) +
        (e.note ? '<span class="st__note">' + esc(e.note) + "</span>" : "") + "</span>" +
        '<span class="st__pct">' + (e.percentile ? '<span class="pct pct--sm">' + esc(e.percentile) + "</span>" : "") + "</span>" +
        '<span class="st__time">' + esc(e.time) + "</span>" +
        '<span class="st__delta">' + (i === 0 ? "First" : delta > 0 ? "−" + fmtDur(delta) : "") + "</span></li>";
    }).join("");
    return '<article class="pb reveal"><header class="pb__head"><span class="tag">' + esc(p.event) + '</span><h3 class="pb__format">' + esc(p.format || "") + "</h3></header>" +
      '<div class="pb__top">' +
        '<div class="pb__fp">' +
          '<div class="fp fp--first"><p class="pb__k">First race</p><p class="fp__time">' + esc(f.time) + '</p><p class="pb__where">' + esc(f.race) + " · " + esc(fmt(f.date, "my")) + "</p></div>" +
          '<span class="fp__arrow" aria-hidden="true">→</span>' +
          '<div class="fp fp--pb"><p class="pb__k">Personal best</p><p class="fp__time">' + esc(best.time) + '</p><p class="pb__where">' + esc(best.race) + " · " + esc(fmt(best.date, "my")) + "</p></div>" +
        "</div>" +
        '<dl class="pb__nums">' +
          (f.percentile && best.percentile && f !== best ? '<div class="pb__rank"><dt>Field ranking</dt><dd>' + esc(f.percentile) + ' <span aria-hidden="true">→</span><span class="sr-only"> to </span> <mark>' + esc(best.percentile.replace(/^Top\s*/i, "")) + "</mark></dd></div>" : "") +
          (cut > 0 ? '<div><dt>Time cut</dt><dd>−' + esc(cut < 60 ? (Math.round(cut * 10) / 10) + "s" : fmtDur(cut)) + "</dd></div>" : "") +
          '<div><dt>' + (prs === 1 ? "New PR" : "New PRs") + '</dt><dd>' + prs + "</dd></div>" +
          (months > 0 ? '<div><dt>Built over</dt><dd>' + months + " <small>months</small></dd></div>" : "") +
        "</dl>" +
      "</div>" +
      '<div class="pb__viz">' + (es.length > 1 ? '<div class="chart-wrap">' + chart(es, "c" + idx) + "</div>" : "") + '<ol class="steps">' + steps + "</ol></div>" +
    "</article>";
  }).join("");
  $("pbs").innerHTML = (board ? '<h3 class="perf__k">Personal bests</h3><ul class="board">' + board + "</ul>" : "") +
    (prog ? '<h3 class="perf__k">First race → personal best</h3><div class="progs">' + prog + "</div>" : "");

  var athx = arr(a.athxFinishes);
  if (athx.length) {
    $("athx").hidden = false;
    $("athx-list").innerHTML = athx.map(function (r) {
      if (typeof r === "string") return '<li class="athx__item"><span class="athx__ev">' + esc(r) + "</span></li>";
      var place = r.place != null ? r.place : r.finish != null ? r.finish : r.position;
      var placeTxt = place == null ? "" : typeof place === "number" ? ordinal(place) : String(place);
      var segs = arr(r.segments);
      return '<li class="athx__item">' +
        '<div class="athx__main">' +
          (placeTxt ? '<p class="athx__place">' + esc(placeTxt) + '<span>overall</span></p>' : "") +
          '<div><h4 class="athx__ev">' + esc(r.event || r.race || r.name || "") + "</h4>" +
          '<p class="athx__meta">' + esc([r.division || r.category || r.format, r.partner ? "with " + r.partner : "", r.date ? fmt(r.date, "my") : r.year, r.note].filter(Boolean).join(" · ")) + "</p></div>" +
        "</div>" +
        (segs.length ? '<ol class="segs">' + segs.map(function (g) {
          var win = Number(g.rank) === 1;
          return '<li class="seg' + (win ? " seg--win" : "") + '"><span class="seg__rank">' + (g.rank != null ? esc(typeof g.rank === "number" ? ordinal(g.rank) : g.rank) : "") + "</span>" +
            '<span class="seg__name">' + esc(g.name) + (win ? ' <span class="seg__flag">Segment win</span>' : "") + "</span>" +
            (g.result ? '<span class="seg__res">' + esc(g.result) + "</span>" : "") + "</li>";
        }).join("") + "</ol>" : "") +
      "</li>";
    }).join("");
  }
  function ordinal(n) { var s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
  if (!progs.length && !athx.length) $("performance").hidden = true;

  /* ---------- 8. calendar ---------- */
  $("races").innerHTML = upcoming.length ? upcoming.map(function (u, i) {
    var p = parts(u.date), evs = arr(u.events);
    return '<li class="race reveal' + (i === 0 ? " race--next" : "") + (u.tentative ? " race--tent" : "") + '">' +
      '<p class="race__date"><span class="race__mo">' + MONTHS[p.m].slice(0, 3) + '</span><span class="race__d">' + p.d + '</span><span class="race__y">' + p.y + "</span></p>" +
      '<div class="race__body">' +
        '<p class="race__tags"><span class="tag tag--' + esc(String(u.series || "").toLowerCase()) + '">' + esc(u.series) + "</span>" +
          (i === 0 ? '<span class="tag tag--next">Next up</span>' : "") +
          (u.tentative ? '<span class="tag tag--tent">Tentative</span>' : "") + "</p>" +
        '<h3 class="race__name">' + esc(u.event) + "</h3>" +
        '<p class="race__loc">' + (u.location ? esc(u.location) : "Location to be announced") + "</p>" +
        (evs.length ? '<div class="race__evs"><p class="race__evs-k">' + evs.length + (evs.length === 1 ? " event" : " events") + '</p><ul>' +
          evs.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul></div>" : "") +
      "</div>" +
      (u.goal ? '<p class="race__goal"><span>Goal</span>' + esc(u.goal) + "</p>" : '<p class="race__goal race__goal--empty" aria-hidden="true"></p>') +
    "</li>";
  }).join("") : '<li class="races__empty">The next race calendar is being finalized. Get in touch for dates.</li>';

  /* ---------- 9. brands ---------- */
  var brands = a.brands || {};
  var career = arr(brands.career).map(function (b) { return Object.assign({ src: "In-house" }, b); });
  var clients = arr(brands.clients).map(function (b) { return Object.assign({ src: "Advised" }, b); });
  var tagged = career.concat(clients).filter(function (b) { return b.tag; });
  var rest = function (xs) { return xs.filter(function (b) { return !b.tag; }); };
  $("brands-intro").textContent = "Nearly 20 years growing consumer brands, from the inside and as an advisor. Fitness, nutrition and supplement names lead the wall.";
  var wall = "";
  if (tagged.length) {
    wall += '<div class="wall__feat"><p class="wall__k">Fitness, nutrition &amp; supplements</p><ul class="wall__big">' +
      tagged.map(function (b) {
        return '<li><span class="wm">' + esc(b.name) + '</span><span class="wm__meta">' + esc(b.tag) + " · " + esc(b.src) + "</span></li>";
      }).join("") + "</ul></div>";
  }
  var group = function (k, xs) {
    return xs.length ? '<div class="wall__grp"><p class="wall__k">' + k + '</p><ul class="wall__list">' +
      xs.map(function (b) { return '<li class="wm wm--sm">' + esc(b.name) + "</li>"; }).join("") + "</ul></div>" : "";
  };
  wall += '<div class="wall__rest">' + group("Built in-house", rest(career)) + group("Advised", rest(clients)) + "</div>";
  $("wall").innerHTML = wall;
  if (!career.length && !clients.length) $("wall").remove();

  var partners = arr(a.partners);
  if (partners.length) {
    $("working").hidden = false;
    $("working-list").innerHTML = partners.map(function (p) {
      var inner = (p.url ? '<span class="wk__play" aria-hidden="true">▶</span>' : '<span class="wk__play wk__play--init" aria-hidden="true">' + esc(String(p.name || "").charAt(0)) + "</span>") +
        '<span class="wk__body"><span class="wk__name">' + esc(p.name) + '</span><span class="wk__meta">' +
        esc([p.category, p.date].filter(Boolean).join(" · ")) + "</span>" +
        (p.note ? '<span class="wk__note">' + esc(p.note) + "</span>" : "") +
        (p.url ? '<span class="wk__cta">Watch the reel <span aria-hidden="true">↗</span></span>' : "") + "</span>";
      return p.url
        ? '<a class="wk" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + inner + NEW_TAB + "</a>"
        : '<div class="wk">' + inner + "</div>";
    }).join("");
  }

  /* ---------- 10. podcasts ---------- */
  var pods = arr(a.podcasts);
  if (pods.length) {
    $("hear").hidden = false;
    var wave = '<svg class="pod__wave" viewBox="0 0 120 32" aria-hidden="true">' +
      [8, 18, 12, 26, 16, 30, 20, 10, 24, 14, 28, 12, 18, 8, 22, 16, 26, 10, 14, 6].map(function (h, i) {
        return '<rect x="' + i * 6 + '" y="' + (32 - h) / 2 + '" width="3" height="' + h + '" rx="1.5"/>';
      }).join("") + "</svg>";
    $("pods").innerHTML = pods.map(function (p, i) {
      var video = /instagram\.com|youtube\.com|youtu\.be/.test(p.url || "");
      return '<li class="pod reveal" style="--d:' + i * 80 + 'ms">' + wave +
        '<p class="pod__show">' + esc(p.show) + "</p>" +
        '<h3 class="pod__title">' + esc(p.title) + "</h3>" +
        (p.url ? ext(p.url, (video ? "Watch" : "Listen") + ' <span aria-hidden="true">↗</span>', "pod__link") : "") + "</li>";
    }).join("");
  }

  /* ---------- 11. partner ---------- */
  var aud = a.audience || {};
  $("aud-summary").textContent = aud.summary || "";
  var ig = arr(aud.platforms).filter(function (p) { return /instagram/i.test(p.name); })[0];
  if (ig && ig.url) {
    var h = $("aud-handle");
    h.hidden = false;
    h.href = ig.url;
    // Follower counts intentionally not shown unless audience.showMetrics is true
    h.innerHTML = "Instagram " + esc(ig.handle) + (aud.showMetrics && ig.metric ? " · " + esc(ig.metric) + " " + esc(ig.label || "") : "") +
      ' <span aria-hidden="true">↗</span>' + NEW_TAB;
  }
  $("values").innerHTML = arr(a.sponsorValue).map(function (v, i) {
    return '<li class="val reveal"><span class="val__n">' + String(i + 1).padStart(2, "0") + '</span><h3 class="val__t">' + esc(v.title) + '</h3><p class="val__p">' + esc(v.text) + "</p></li>";
  }).join("");
  var subj = function (s) { return "mailto:" + (a.contact && a.contact.email ? a.contact.email : "") + "?subject=" + encodeURIComponent(s); };
  $("tiers").innerHTML = arr(a.partnershipTiers).map(function (t) {
    return '<article class="tier reveal' + (t.featured ? " tier--feat" : "") + '">' +
      (t.featured ? '<span class="tier__badge">Recommended</span>' : "") +
      '<h4 class="tier__name">' + esc(t.name) + '</h4><p class="tier__blurb">' + esc(t.blurb) + "</p>" +
      "<ul>" + arr(t.perks).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" +
      '<a class="btn ' + (t.featured ? "" : "btn--ghost ") + 'btn--block" href="' + esc(subj(t.name + " partnership: " + a.name)) + '">Inquire about ' + esc(t.name) + "</a></article>";
  }).join("");

  /* ---------- 12. off the course ---------- */
  var facts = arr(a.funFacts).map(function (f) {
    var i = f.indexOf(":");
    return i > 0 && i < 30 ? { k: f.slice(0, i), v: f.slice(i + 1).trim() } : { k: "Fun fact", v: f };
  });
  if (a.trainsWith) facts.push({ k: "Trains with", v: a.trainsWith });
  if (a.location) facts.push({ k: "Home base", v: a.location });
  if (site && site.url) facts.push({ k: "By day", v: company || site.label, sub: company ? companyLine : "", link: ext(site.url, esc(site.label || site.url) + ' <span aria-hidden="true">↗</span>', "fact__link") });
  $("facts").innerHTML = facts.map(function (f, i) {
    return '<li class="fact reveal' + (i === 0 ? " fact--lead" : "") + '"><p class="fact__k">' + esc(f.k) + '</p><p class="fact__v">' + esc(f.v).replace(/&quot;([^&]+?)&quot;/g, "\u201C$1\u201D") + "</p>" + (f.sub ? '<p class="fact__sub">' + esc(f.sub) + "</p>" : "") + (f.link || "") + "</li>";
  }).join("");
  if (!facts.length) $("off").hidden = true;

  /* ---------- 13. gallery ---------- */
  if (gallery.length) {
    $("gallery").innerHTML = gallery.map(function (g) {
      return '<figure class="gal reveal">' + img(g.src, g.alt, g.position) + (g.alt ? "<figcaption>" + esc(g.alt) + "</figcaption>" : "") + "</figure>";
    }).join("");
  } else $("gallery").remove();
  if (a.highlightsUrl) { $("highlights-link").href = a.highlightsUrl; $("highlights-link").hidden = false; }
  if (!gallery.length && !a.highlightsUrl) $("gallery-sec").hidden = true;

  /* ---------- 14. contact ---------- */
  var c = a.contact || {};
  $("contact-lede").textContent = "Tell " + first + " about your brand and what you want a partnership to deliver.";
  if (c.email) {
    $("contact-email").href = subj("Sponsorship inquiry: " + a.name);
    $("contact-email").innerHTML = "Email " + esc(c.email);
  } else $("contact-email").remove();
  if (c.instagram) {
    $("contact-ig").hidden = false;
    $("contact-ig").href = c.instagram;
    $("contact-ig").innerHTML = "Instagram" + (ig && ig.handle ? " " + esc(ig.handle) : "") + ' <span aria-hidden="true">↗</span>' + NEW_TAB;
  }

  /* ---------- reveal on scroll ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window && window.innerHeight < 1600 && !navigator.webdriver) {
    document.documentElement.classList.add("js-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    [].forEach.call(document.querySelectorAll(".reveal"), function (el) { io.observe(el); });
    // Safety net: never leave content hidden (e.g. print, very tall windows, odd browsers)
    setTimeout(function () {
      [].forEach.call(document.querySelectorAll(".reveal:not(.is-in)"), function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("is-in");
      });
    }, 1500);
    window.addEventListener("beforeprint", function () {
      [].forEach.call(document.querySelectorAll(".reveal"), function (el) { el.classList.add("is-in"); });
    });
  }

  /* ---------- nav state ---------- */
  var nav = $("nav");
  var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 24); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
