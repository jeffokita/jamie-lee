/*
 * Athlete profile data — Jamie Lee
 *
 * Everything on the page is driven from this file. Values marked SAMPLE are
 * placeholders. Set `draft: true` to show a "sample data" banner.
 *
 * Image paths are relative to the site root; version pages in v1/..v5/
 * prefix them with "../".
 *
 * Images: drop files into /images and reference them by path. Any missing
 * image falls back to a styled placeholder, so the page never looks broken.
 */
window.ATHLETE = {
  draft: false,

  name: "Jamie Lee",
  firstName: "Jamie",
  tagline: "Mom, founder, and hybrid racer. Every podium built on consistency, grit, and self-belief.",
  location: "Pacific Northwest",
  disciplines: ["HYROX", "DEKA", "ATHX"],
  category: "Hybrid fitness racing",
  // One-line pitch that blends racing with her consumer-brand career
  positioning: "A hybrid racer with nearly 20 years of consumer empathy, building brands like Nike, Vital Proteins, and Everlane.",
  trainsWith: "Underdog Fitness",
  heroImage: "images/hero.jpg",
  portrait: "images/portrait.jpg",

  // Headline numbers shown in the stat strip under the hero
  stats: [
    { value: "3×", label: "DEKA World Championships" },
    { value: "6", label: "DEKA Worlds qualifications, 2026" },
    { value: "2nd", label: "DEKA MILE Worlds, 2024" },
    { value: "ATHX", label: "World Finals, Lisbon 2026" },
  ],
  // Counts Jamie still needs to confirm; pages hide these while null
  podiums: null,
  topFiveFinishes: null,

  bio: [
    "Jamie Lee is a hybrid fitness racer competing in HYROX, DEKA, and ATHX. Off the course she's a mom and the founder of JME Labs, a fractional eCommerce GM and growth advisor for consumer brands, with nearly 20 years at companies like Nike, Vital Proteins, and Everlane.",
    "She came up through road racing, OCR, and triathlons (including one half Ironman) as a self-described middle-of-the-pack athlete. In 2023 she was selected for Team USA OCR; postpartum she went all in on hybrid racing, finishing 2nd in her division in the DEKA MILE at the 2024 DEKA World Championships. In 2025 she broke her hand in 15 places and was racing again within three months. In 2026 she qualified for six events at DEKA Worlds and is competing at the ATHX World Finals in Lisbon.",
    "She trains with Underdog Fitness, mostly in her home gym, and most of her podium finishes have come since becoming a mom. Her focus for 2027: building strength, power, and speed on the way to becoming the ultimate hybrid athlete.",
  ],

  // Career timeline, shown as story chapters
  story: [
    { year: "Before 2023", title: "The everyday athlete", text: "Jamie spent years in road racing, group fitness classes, and triathlons, up to one half Ironman. By her own account she was a middle-of-the-road athlete, finishing mid-pack if not near the back: an everyday athlete who loved fitness and community." },
    { year: "2023", title: "The call-up", text: "She got serious about Spartan obstacle course racing. Four podiums in a single quarter earned her selection to Team USA OCR for multiple events. She also started racing DEKA, earning two World Championship bids she couldn't use while pregnant, and tried HYROX for the first time." },
    { year: "2024", title: "All in", text: "Postpartum, she went all in on hybrid racing. At the 2024 DEKA World Championships she finished 2nd in her division in the DEKA MILE and 5th in the DEKA FIT." },
    { year: "2025", title: "Fifteen places", text: "She earned her first HYROX podium at HYROX Las Vegas in February, set her solo HYROX PB of 1:12:36 in New York in May, and then, over Labor Day, she broke her hand in 15 places: pins, surgery, and weeks off training. She was racing again by late November." },
    { year: "2026", title: "Diversify", text: "She moved up to HYROX Pro, added doubles and team races to her individual racing, and took on ATHX, a strength-forward format, even though she's never considered herself a strength athlete. At ATHX Houston she and David Parham finished 3rd in Mixed pairs, winning the MetCon X segment. She qualified for six events at the DEKA World Championships, competing in four, and is competing at the ATHX World Finals in Lisbon in the overall teams category." },
    { year: "2027", title: "The ultimate hybrid athlete", text: "Next, Jamie is building strength, power, and speed, and proving it across event types like ATHX." },
  ],

  // Light personal details for the off-course section
  funFacts: [
    "Walkout song: \"Cinderella Man\" by Eminem",
    "Once fell off a treadmill and left with staples",
  ],

  highlights: [
    "Qualified for 6 events at the 2026 DEKA World Championships, competing in 4",
    "Competing at the 2026 ATHX World Finals in Lisbon, teams overall category",
    "First HYROX podium: 2nd in age group, Doubles Women, HYROX Las Vegas 2025",
    "3rd place, Mixed pairs at ATHX Houston 2026, winning the MetCon X segment",
    "4th in age group at HYROX New York 2025, top 4% of 1,231 women",
    "2024 DEKA World Championships: 2nd in division (MILE), 5th (FIT)",
    "Back racing within 3 months of breaking her hand in 15 places, 2025",
    "Racing the HYROX Pro Women division since 2026",
  ],

  // Press / feature interview, shown as a pull quote with a link
  interview: {
    quote: "Consistency and self-belief can make you stronger than you ever imagined.",
    title: "Feature Friday: Jamie Lee",
    subtitle: "Mom, eCommerce Advisor & Hybrid Athlete",
    date: "July 2025",
    url: "https://cubic-fork-9f1.notion.site/Feature-Friday-Jamie-Lee-24113ab596eb80929c5fdab554547d71",
  },

  // series: "HYROX" or "DEKA" (drives the filter buttons)
  // place: finishing position in the division at that race; field: division size;
  // ageGroupPlace: place within her age group (hyresult.com)
  // pb: true marks a personal best for that division
  results: [
    { date: "2026-10-10", event: "HYROX Boston",    series: "HYROX", format: "Doubles Mixed",     time: "1:08:06", place: 147,  pb: true, partners: "Jim Delorie" },
    { date: "2026-05-28", event: "HYROX New York",  series: "HYROX", format: "Doubles Mixed",     time: "1:24:30", place: 1949,           partners: "Steven Uvena" },
    { date: "2026-04-18", event: "HYROX Monterrey", series: "HYROX", format: "Pro Women",         time: "1:41:00", place: 63 },
    { date: "2026-02-20", event: "HYROX Las Vegas", series: "HYROX", format: "Team Relay Mixed",  time: "1:06:31", place: 19,             partners: "Jim Delorie, Kelly Fuson, Kevin Gregory" },
    { date: "2026-02-20", event: "HYROX Las Vegas", series: "HYROX", format: "Pro Women",         time: "1:24:03", place: 106,  pb: true },
    { date: "2026-01-29", event: "HYROX Phoenix",   series: "HYROX", format: "Pro Doubles Women", time: "1:10:11", place: 52,   pb: true, partners: "Kristine Pavelchak" },
    { date: "2026-01-29", event: "HYROX Phoenix",   series: "HYROX", format: "Team Relay Mixed",  time: "56:12",   place: 6,    pb: true, partners: "Sam Rao, Kevin Gregory, Karyn Guidry" },
    { date: "2025-12-20", event: "HYROX Vancouver", series: "HYROX", format: "Pro Doubles Women", time: "1:19:26", place: 31,             partners: "Kelly Fuson" },
    { date: "2025-02-01", event: "HYROX Las Vegas", series: "HYROX", format: "Doubles Women",     time: "1:08:28", place: 15,   pb: true, partners: "Kristine Pavelchak", field: 687, ageGroupPlace: 2 },
    { date: "2025-05-30", event: "HYROX New York",  series: "HYROX", format: "Women",             time: "1:12:36", place: 43,   pb: true, field: 1231, ageGroupPlace: 4 },
    { date: "2025-04-26", event: "HYROX Atlanta",   series: "HYROX", format: "Women",             time: "1:15:36", place: 44, field: 810, ageGroupPlace: 15 },
    { date: "2024-11-16", event: "HYROX Chicago Navy Pier", series: "HYROX", format: "Women",     time: "1:15:30", place: 41, field: 594, ageGroupPlace: 11 },
    { date: "2023-06-11", event: "HYROX New York",  series: "HYROX", format: "Women",             time: "1:20:36", place: 27, field: 241, ageGroupPlace: 12 },
    { date: "2023-04-22", event: "HYROX Anaheim",   series: "HYROX", format: "Women",             time: "1:22:26", place: 26, field: 140, ageGroupPlace: 6 },
    { date: "2023-02-11", event: "HYROX Chicago – North American Open Championship", series: "HYROX", format: "Women", time: "1:21:37", place: 49, field: 195, ageGroupPlace: 8 },
  ],

  // Personal-best progressions for solo events (team results vary with partners).
  // Each entry is a PR at the time it was set, oldest first.
  // percentile: optional, e.g. "Top 5%". Add DEKA, half marathon and 5K as data comes in.
  // percentile = overall place / women in the division (hyresult.com).
  pbProgressions: [
    { event: "HYROX", format: "Women (solo)", entries: [
      { date: "2023-02-11", race: "HYROX Chicago", time: "1:21:37", percentile: "Top 26%" },
      { date: "2023-06-11", race: "HYROX New York", time: "1:20:36", percentile: "Top 12%" },
      { date: "2024-11-16", race: "HYROX Chicago", time: "1:15:30", percentile: "Top 7%" },
      { date: "2025-05-30", race: "HYROX New York", time: "1:12:36", percentile: "Top 4%", note: "4th in age group (W35-39)" },
    ] },
    { event: "HYROX", format: "Pro Women (solo)", entries: [
      { date: "2026-02-20", race: "HYROX Las Vegas", time: "1:24:03" },
    ] },
    { event: "DEKA", format: "DEKA MILE (solo)", entries: [
      { date: "2024-12-14", race: "DEKA World Championships", time: "23:54.7", note: "2nd in age group (F35-39)" },
      { date: "2025-07-12", race: "DEKA MILE, G3 Fitness", time: "23:45", note: "1st female, 2nd overall" },
    ] },
    { event: "DEKA", format: "DEKA FIT (solo)", entries: [
      { date: "2024-12-13", race: "DEKA World Championships", time: "39:40.3", note: "5th in age group (F35-39)" },
    ] },
  ],

  // ATHX is too variable for times; list leaderboard finishes instead.
  // segments: per-segment rank among teams in the division.
  athxFinishes: [
    { event: "ATHX Houston", year: 2026, division: "Mixed pairs", partner: "David Parham", place: 3,
      segments: [
        { name: "MetCon X", rank: 1, result: "13:22" },
        { name: "Endurance", rank: 2, result: "8.053 km" },
        { name: "Strength", rank: 7, result: "452 kg" },
      ] },
  ],

  // From the family calendar. tentative: true shows a "Tentative" label.
  upcoming: [
    { date: "2026-11-28", event: "ATHX World Finals", series: "ATHX", location: "Lisbon, Portugal", events: ["Teams, overall category"] },
    { date: "2026-12-09", event: "DEKA World Championships", series: "DEKA", location: "", goal: "Return to the Worlds podium",
      events: ["DEKA MILE (individual)", "DEKA FIT (teams)", "DEKA MILE (teams)", "DEKA STRONG (teams)", "DEKA STRONG exhibition (teams, with Shokz)"] },
    { date: "2026-12-18", event: "HYROX Vancouver", series: "HYROX", location: "Vancouver, BC", tentative: true },
    { date: "2027-03-26", event: "DEKA Denver", series: "DEKA", location: "Denver, CO", goal: "Gold" },
    { date: "2027-05-01", event: "DEKA Anaheim", series: "DEKA", location: "Anaheim, CA" },
    { date: "2027-05-21", event: "HYROX Portland", series: "HYROX", location: "Portland, OR", goal: "Home-city race" },
  ],

  // Audience / reach: what sponsors look at first
  // Audience numbers are hidden for now at Jamie's request (showMetrics: false)
  audience: {
    showMetrics: false,
    summary: "Jamie reaches hybrid athletes, team-race communities, busy parents who train, and the founders and operators she works with: the people who buy training gear, nutrition, and recovery products.",
    platforms: [
      { name: "Instagram", handle: "@jamielel", url: "https://www.instagram.com/jamielel", metric: "1,040", label: "followers" },
    ],
  },

  // Why partner: value propositions for sponsors
  sponsorValue: [
    { title: "Race-day visibility", text: "Your brand at the start line and on course across HYROX, DEKA, and ATHX: kit, race-day content, and finish-line moments." },
    { title: "Authentic content", text: "Real training, real races, real results. Product shown where it's actually used: in the sled lane, on the erg, and in recovery." },
    { title: "The growth of hybrid racing", text: "Hybrid fitness racing is one of the fastest-growing categories in fitness. Partner early with an athlete racing across HYROX, DEKA, and ATHX." },
    { title: "Consumer empathy, built in", text: "Nearly 20 years building consumer brands like Nike, Vital Proteins, and Everlane. Jamie understands your customer, knows what a partnership needs to deliver, and reports on it." },
    { title: "Community reach", text: "Jamie races doubles and team events alongside individual races, and she's part of a wide community of founders and operators, so your brand reaches both." },
  ],

  partnershipTiers: [
    {
      name: "Supporter",
      blurb: "Product partnership",
      perks: ["Product use in training & race content", "Tagged posts each race block", "Honest product reviews"],
    },
    {
      name: "Partner",
      blurb: "Season-long sponsorship",
      featured: true,
      perks: ["Logo on race kit", "Monthly dedicated content", "Race-day stories & recaps", "Discount code tracking"],
    },
    {
      name: "Title",
      blurb: "Flagship ambassador",
      perks: ["Primary kit placement", "Event appearances & clinics", "Co-branded campaigns", "Quarterly performance reports"],
    },
  ],

  // position: optional CSS object-position to control cropping
  gallery: [
    { src: "images/race-run.jpg", alt: "Jamie racing between stations", position: "center 85%" },
    { src: "images/deka-airbike.jpg", alt: "Jamie on the air bike at DEKA Zone 7", position: "center 60%" },
    { src: "images/sled-push.jpg", alt: "Jamie training the sled push" },
  ],

  // Jamie's own Instagram bio line
  instagramBio: "Building Brands between Boarding Passes, Burpees, & Bedtime Stories",

  // Past and current brand partners
  partners: [
    { name: "Nocturne", category: "Sleep supplement", date: "Aug 2026", url: "https://www.instagram.com/reel/Dcbq377JyrP/" },
    { name: "Shokz", category: "Open-ear headphones", date: "Dec 2026", note: "Racing a DEKA STRONG exhibition team race with Shokz at the 2026 DEKA World Championships" },
  ],

  // Brands Jamie has built from the inside or advised (from jamiealee.com).
  // tag marks fitness, nutrition and supplement brands to feature first.
  brands: {
    career: [
      { name: "Nike", tag: "Athletic" },
      { name: "Vital Proteins", tag: "Supplements" },
      { name: "Everlane" },
      { name: "Walmart" },
      { name: "EA" },
      { name: "Sony" },
    ],
    clients: [
      { name: "Barebells", tag: "Nutrition" },
      { name: "The Vitamin Shoppe", tag: "Supplements" },
      { name: "Bio.me" },
      { name: "Tropic of C" },
      { name: "RNWY" },
      { name: "Be Love" },
      { name: "HiNote" },
      { name: "Cocomo" },
      { name: "SHII" },
      { name: "Shibumi Shade" },
      { name: "Buitoni" },
      { name: "Hanna Andersson" },
      { name: "Stripes" },
    ],
  },

  // Podcasts, so brands can hear how Jamie connects with people
  podcasts: [
    { show: "UC Berkeley Haas Podcasts", title: "Leading Digital Transformation with a Global Perspective", url: "https://www.haaspodcasts.org/episodes/onehaas/jamie-lee-mba-18-leading-digital-transformation-with-a-global-perspective" },
    { show: "Women in Retail", title: "How This 2021 Woman on the Rise is Leading Retail's Digital Transformation", url: "https://www.womeninretail.com/podcast/how-this-2021-woman-on-the-rise-is-leading-retails-digital-transformation/" },
    { show: "USC Entrepreneurs Fireside Chat", title: "Journey to Solopreneurship", url: "https://www.instagram.com/p/DFI8GNwSS58/" },
  ],

  // External links
  sponsorshipReelUrl: "https://www.instagram.com/reel/Dcbq377JyrP/", // Nocturne sleep supplement partnership, Aug 2026 (1,266 views)
  website: { url: "https://www.jamiealee.com/", label: "jamiealee.com", blurb: "JME Labs: eCommerce & growth for consumer brands" },

  // Instagram story highlight of race-day content
  highlightsUrl: "https://www.instagram.com/stories/highlights/17931611258975231/",

  contact: {
    email: "info.jamiealee@gmail.com", // public contact address from jamiealee.com
    instagram: "https://www.instagram.com/jamielel",
  },
};
