(function () {
  "use strict";
  var a = window.ATHLETE;
  if (!a) return;

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var src = function (p) { return !p ? "" : /^(https?:)?\/\//.test(p) ? p : "../" + p; };
  var ext = function (url, label, cls) {
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener"' + (cls ? ' class="' + cls + '"' : "") + ">" + label + "</a>";
  };
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var parts = function (iso) { var p = String(iso).split("-").map(Number); return { y: p[0], m: p[1] - 1, d: p[2] }; };
  var fmt = function (iso, style) {
    var p = parts(iso);
    if (style === "short") return MONTHS[p.m].slice(0, 3) + " " + p.d;
    if (style === "monthyear") return MONTHS[p.m] + " " + p.y;
    return MONTHS[p.m] + " " + p.d + ", " + p.y;
  };
  var ordinal = function (n) {
    var s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  var arrow = '<span aria-hidden="true" class="arr">&rarr;</span>';
  var newTab = '<span class="sr-only"> (opens in a new tab)</span>';

  function img(p, alt, pos, extra) {
    if (!p) return "";
    return '<img src="' + esc(src(p)) + '" alt="' + esc(alt || "") + '" decoding="async"' +
      (pos ? ' style="object-position:' + esc(pos) + '"' : "") + (extra || "") + ">";
  }
  function figure(item, cls, capPrefix) {
    if (!item) return "";
    return '<figure class="' + cls + '"><div class="fig__img">' + img(item.src, item.alt, item.position) +
      '</div><figcaption>' + (capPrefix ? '<span class="cap-label">' + esc(capPrefix) + "</span> " : "") + esc(item.alt) + "</figcaption></figure>";
  }

  /* ---------- Meta ---------- */
  document.title = a.name + " | A Profile";
  if (a.draft) $("draft-banner").hidden = false;
  $("mast-name").textContent = a.name;
  $("partner-first").textContent = a.firstName;
  $("foot-name").textContent = a.name;
  $("foot-meta").innerHTML = esc((a.disciplines || []).join(" · ")) + (a.location ? " &middot; " + esc(a.location) : "");

  /* ---------- Opener ---------- */
  $("hero-media").innerHTML = '<img src="' + esc(src(a.heroImage)) + '" alt="' + esc(a.name) +
    ', leaning on a barbell in a squat rack" fetchpriority="high">';
  $("hero-cap").innerHTML = '<span class="cap-label">Cover</span> ' + esc(a.name) + ", " + esc(a.location || "") + ".";
  $("kicker").innerHTML = "Profile <span>/</span> " + esc((a.disciplines || []).join(" · "));
  $("dek").textContent = a.tagline;
  $("byline").innerHTML = "A sponsorship feature on <strong>" + esc(a.name) + "</strong>" +
    (a.location ? " &middot; " + esc(a.location) : "");

  /* ---------- Story ---------- */
  var bio = a.bio || [];
  var gallery = a.gallery || [];
  var story = [];

  if (bio[0]) story.push('<p class="lede dropcap">' + esc(bio[0]) + "</p>");

  var CHAPTERS = [
    { num: "I", year: "2023", title: "The call-up", kicker: "OCR & Team USA" },
    { num: "II", year: "2024", title: "All in", kicker: "Postpartum & the DEKA Worlds" },
    { num: "III", year: "2025", title: "Fifteen places", kicker: "The broken hand" },
    { num: "IV", year: "2026", title: "Going Pro", kicker: "HYROX Pro" },
  ];
  var sentences = bio[1] ? bio[1].split(/(?<=[.!?])\s+(?=[A-Z])/) : [];

  var quote = "";
  if (a.interview && a.interview.quote) {
    var iv = a.interview;
    quote = '<figure class="pullquote"><blockquote><p>' + esc(iv.quote) + "</p></blockquote>" +
      "<figcaption><span class=\"pq-who\">" + esc(a.name) + "</span>" +
      (iv.title ? ', in <cite>&ldquo;' + esc(iv.title) + "&rdquo;</cite>" : "") +
      (iv.subtitle ? " &mdash; " + esc(iv.subtitle) : "") + (iv.date ? ", " + esc(iv.date) : "") +
      (iv.url ? "<br>" + ext(iv.url, "Read the full interview " + arrow + newTab, "pq-link") : "") +
      "</figcaption></figure>";
  }

  if (sentences.length === CHAPTERS.length) {
    sentences.forEach(function (s, i) {
      var c = CHAPTERS[i];
      if (i === 0 && gallery[1]) story.push(figure(gallery[1], "inset inset--right", "Race day"));
      if (i === 2 && gallery[0]) story.push(figure(gallery[0], "inset inset--right inset--run", "On course"));
      story.push(
        '<section class="chapter" aria-labelledby="ch' + i + '">' +
          '<div class="chapter__mark" aria-hidden="true"><span class="chapter__num">' + c.num + '</span><span class="chapter__year">' + c.year + "</span></div>" +
          '<h3 class="chapter__title" id="ch' + i + '"><span class="chapter__kicker">' + c.num + ". " + esc(c.kicker) + "</span>" + esc(c.title) + "</h3>" +
          '<p class="chapter__text' + (i === 2 ? " dropcap dropcap--sm" : "") + '">' + esc(s) + "</p>" +
        "</section>"
      );
      if (i === 1) story.push(quote);
    });
  } else {
    bio.slice(1, 2).forEach(function (p) { story.push("<p>" + esc(p) + "</p>"); });
    story.push(quote);
  }

  if (bio[2]) {
    story.push(
      '<section class="chapter chapter--coda" aria-labelledby="ch-coda">' +
        '<h3 class="chapter__title" id="ch-coda"><span class="chapter__kicker">Between the lines</span>In the cracks of the day</h3>' +
        "<p>" + esc(bio[2]) + "</p>" +
        bio.slice(3).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
      "</section>"
    );
  }

  // Photo spread: portrait + remaining gallery images
  var spread = [];
  if (a.portrait) spread.push({ src: a.portrait, alt: a.firstName + " on the rower in her home gym", position: "center 30%" });
  gallery.slice(2).forEach(function (g) { spread.push(g); });
  if (spread.length) {
    story.push('<div class="spread spread--' + Math.min(spread.length, 3) + '">' +
      spread.map(function (g, i) { return figure(g, "spread__fig", i === 0 ? "At home" : "Training"); }).join("") +
      "</div>");
  }
  $("story-main").innerHTML = story.join("");

  /* ---------- Sidebar ---------- */
  $("stats").innerHTML = (a.stats || []).map(function (s) {
    return '<div class="numbers__row"><dt>' + esc(s.label) + "</dt><dd>" + esc(s.value) + "</dd></div>";
  }).join("");
  $("highlights").innerHTML = (a.highlights || []).map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("");

  /* ---------- Results ---------- */
  var results = (a.results || []).slice().sort(function (x, y) { return x.date < y.date ? 1 : x.date > y.date ? -1 : 0; });
  var series = (a.disciplines || []).filter(function (d) { return d !== "OCR"; }).map(function (d) { return d.replace(/^Spartan\s+/, ""); });
  var counts = {};
  results.forEach(function (r) { counts[r.series] = (counts[r.series] || 0) + 1; });

  $("record-dek").textContent = results.length
    ? results.length + " races logged since " + fmt(results[results.length - 1].date, "monthyear") + ", newest first. Personal bests are marked in red."
    : "";

  // PBs: most recent PB per format
  var seen = {};
  var pbs = results.filter(function (r) {
    if (!r.pb) return false;
    var k = r.series + "|" + r.format;
    if (seen[k]) return false;
    return (seen[k] = true);
  });
  $("pbs").innerHTML = pbs.map(function (r) {
    return '<div class="pb"><p class="pb__format">' + esc(r.series) + " &middot; " + esc(r.format) + '</p><p class="pb__time">' + esc(r.time) +
      '</p><p class="pb__meta">' + esc(r.event.replace(/^HYROX\s+/, "")) + ", " + esc(fmt(r.date, "monthyear")) +
      (r.place ? " &middot; " + ordinal(r.place) : "") + "</p></div>";
  }).join("");

  function renderResults(filter) {
    var rows = results.filter(function (r) { return !filter || filter === "All" || r.series === filter; });
    var lastYear = null;
    var html = rows.map(function (r) {
      var y = parts(r.date).y, head = "";
      if (y !== lastYear) { head = '<tr class="yr"><th colspan="5" scope="rowgroup">' + y + "</th></tr>"; lastYear = y; }
      return head + '<tr class="' + (r.pb ? "is-pb" : "") + '">' +
        '<td class="c-date" data-label="Date">' + esc(fmt(r.date, "short")) + "</td>" +
        '<td class="c-event" data-label="Event"><span class="ev">' + esc(r.event) + "</span>" +
          (r.partners ? '<span class="with">with ' + esc(r.partners) + "</span>" : "") + "</td>" +
        '<td class="c-div" data-label="Division">' + esc(r.format) + "</td>" +
        '<td class="num c-time" data-label="Time">' + esc(r.time) + (r.pb ? ' <abbr class="pbtag" title="Personal best">PB</abbr>' : "") + "</td>" +
        '<td class="num c-place" data-label="Place">' + (r.place ? ordinal(r.place) : "&mdash;") + "</td></tr>";
    }).join("");
    if (!rows.length) html = '<tr><td colspan="5" class="empty">No ' + esc(filter) + " results listed yet. Upcoming " + esc(filter) + " races are on the calendar below.</td></tr>";
    $("results").innerHTML = html;
  }
  var filters = ["All"].concat(series);
  $("filters").innerHTML = filters.map(function (f, i) {
    var n = f === "All" ? results.length : counts[f] || 0;
    return '<button type="button" data-f="' + esc(f) + '" aria-pressed="' + (i === 0) + '">' + esc(f) + " <span>" + n + "</span></button>";
  }).join("");
  $("filters").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    [].forEach.call(this.querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    renderResults(b.getAttribute("data-f"));
  });
  renderResults("All");
  var noRes = series.filter(function (s) { return !counts[s]; });
  $("results-note").textContent = noRes.length ? noRes.join(", ") + " results are not yet listed in this record." : "";

  /* ---------- Upcoming ---------- */
  var now = new Date();
  var today = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  var upcoming = (a.upcoming || []).filter(function (u) { return u.date >= today; })
    .sort(function (x, y) { return x.date < y.date ? -1 : 1; });
  $("upcoming").innerHTML = upcoming.length ? upcoming.map(function (u) {
    var p = parts(u.date);
    return '<li class="race"><p class="race__date"><span class="race__mo">' + MONTHS[p.m].slice(0, 3) + '</span><span class="race__d">' + p.d +
      '</span><span class="race__y">' + p.y + "</span></p>" +
      '<div class="race__body"><p class="race__series">' + esc(u.series) + (u.tentative ? ' <span class="tentative">Tentative</span>' : "") + "</p>" +
      '<h3 class="race__name">' + esc(u.event) + "</h3>" +
      '<p class="race__loc">' + (u.location ? esc(u.location) : "Location to be announced") + "</p>" +
      (u.goal ? '<p class="race__goal"><span>The goal:</span> ' + esc(u.goal) + "</p>" : "") +
      "</div></li>";
  }).join("") : '<li class="race race--empty">New dates coming soon.</li>';

  /* ---------- Audience ---------- */
  var aud = a.audience || {};
  $("aud-summary").textContent = aud.summary || "";
  if (a.instagramBio) $("ig-bio").textContent = a.instagramBio; else document.querySelector(".igbio").remove();
  $("reach").innerHTML = (aud.platforms || []).map(function (p) {
    return '<div class="reach__item"><dt>' + esc(p.label) +
      '<span class="reach__src">' + esc(p.name) + (p.handle ? " &middot; " + (p.url ? ext(p.url, esc(p.handle) + newTab) : esc(p.handle)) : "") + "</span></dt>" +
      '<dd class="reach__metric">' + esc(p.metric) + "</dd></div>";
  }).join("");

  var partner = (a.partners || [])[0];
  if (partner) {
    $("proof-partner").innerHTML = '<p class="proof__label">Past partnership</p>' +
      '<p class="proof__head">' + esc(partner.name) + "</p>" +
      '<p class="proof__text">' + esc(partner.category) + (partner.date ? ", " + esc(partner.date) : "") +
      ". A dedicated Instagram reel made with the brand.</p>" +
      ext(partner.url || a.sponsorshipReelUrl, "Watch the " + esc(partner.name) + " reel " + arrow + newTab, "textlink");
  } else if (a.sponsorshipReelUrl) {
    $("proof-partner").innerHTML = '<p class="proof__label">Past partnership</p>' + ext(a.sponsorshipReelUrl, "Watch the sponsorship reel " + arrow + newTab, "textlink");
  } else { $("proof-partner").remove(); }

  if (a.highlightsUrl) {
    $("proof-highlights").innerHTML = '<p class="proof__label">From the start line</p>' +
      '<p class="proof__head">Race-day highlights</p>' +
      '<p class="proof__text">Saved Instagram stories from race weekends.</p>' +
      ext(a.highlightsUrl, "View highlights on Instagram " + arrow + newTab, "textlink");
  } else { $("proof-highlights").remove(); }

  /* ---------- Partner ---------- */
  var NUM = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
  var nv = (a.sponsorValue || []).length, nt = (a.partnershipTiers || []).length;
  if (NUM[nv] && NUM[nt]) $("partner-dek").textContent = NUM[nv] + " reasons a brand belongs in her corner, and " + NUM[nt].toLowerCase() + " ways to get there.";
  var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  $("values").innerHTML = (a.sponsorValue || []).map(function (v, i) {
    return '<li class="value"><span class="value__num" aria-hidden="true">' + (ROMAN[i] || i + 1) + '</span><h3 class="value__title">' +
      esc(v.title) + '</h3><p class="value__text">' + esc(v.text) + "</p></li>";
  }).join("");

  $("tiers").innerHTML = (a.partnershipTiers || []).map(function (t) {
    return '<div class="tier' + (t.featured ? " tier--featured" : "") + '">' +
      (t.featured ? '<p class="tier__flag">Featured</p>' : "") +
      '<h4 class="tier__name">' + esc(t.name) + '</h4><p class="tier__blurb">' + esc(t.blurb) + "</p>" +
      '<ul class="tier__perks">' + (t.perks || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></div>";
  }).join("");

  var c = a.contact || {};
  if (c.email) {
    $("contact-email").href = "mailto:" + c.email + "?subject=" + encodeURIComponent("Partnership: " + a.name);
    $("contact-email").textContent = c.email;
  } else { $("contact-email").remove(); }
  var links = [];
  if (c.instagram) links.push(ext(c.instagram, "Instagram" + newTab));
  if (a.website && a.website.url) {
    links.push(ext(a.website.url, esc(a.website.label || a.website.url) + newTab) +
      (a.website.blurb ? '<span class="contact__blurb">' + esc(a.website.blurb) + "</span>" : ""));
  }
  $("contact-links").innerHTML = links.map(function (l) { return '<p class="contact__link">' + l + "</p>"; }).join("");
})();
