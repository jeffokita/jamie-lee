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
  disciplines: ["HYROX", "Spartan DEKA", "OCR"],
  heroImage: "images/hero.jpg",
  portrait: "images/portrait.jpg",

  // Headline numbers shown in the stat strip under the hero
  stats: [
    { value: "14", label: "HYROX races" },
    { value: "1:12:36", label: "HYROX Women PB" },
    { value: "Team USA", label: "OCR selection, 2023" },
    { value: "2nd", label: "DEKA MILE Worlds, 2024" },
  ],

  bio: [
    "Jamie Lee is a hybrid athlete racing HYROX, Spartan DEKA, and obstacle course racing (OCR). Off the course she's a mom and the founder of JME Labs, where she works as a fractional eCommerce GM and growth advisor for consumer brands, drawing on nearly 20 years of experience at companies like Nike and Sony.",
    "After years of OCR, Jamie was selected for Team USA OCR in 2023, but pregnancy kept her from competing. Postpartum, she went all in on hybrid racing, and at the 2024 DEKA World Championships finished 2nd in her division in the DEKA MILE and 5th in the DEKA FIT. Over Labor Day 2025 she broke her hand in 15 places (pins, surgery, six weeks off training) and was racing again by late November. Since then she's set HYROX PBs in five divisions and moved up to Pro.",
    "She trains in the cracks of her day (lunch hours, after bedtime, stroller runs) with coaches James Kelly (HYROX), Kevin Gregory (DEKA), and Laurie Porter (running). Most of her podium finishes have come since becoming a mom.",
  ],

  highlights: [
    "Selected for Team USA OCR, 2023",
    "2024 DEKA World Championships: 2nd in division (MILE), 5th (FIT)",
    "Back racing within 3 months of breaking her hand in 15 places, 2025",
    "Racing the HYROX Pro Women division since 2026",
    "1:12:36 HYROX Women PB, set at New York 2025",
    "6th place, Team Relay Mixed at HYROX Phoenix 2026",
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
  // place: finishing position in the division at that race
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
    { date: "2025-05-30", event: "HYROX New York",  series: "HYROX", format: "Women",             time: "1:12:36", place: 43,   pb: true },
    { date: "2025-04-26", event: "HYROX Atlanta",   series: "HYROX", format: "Women",             time: "1:15:36", place: 44 },
    { date: "2024-11-16", event: "HYROX Chicago Navy Pier", series: "HYROX", format: "Women",     time: "1:15:30", place: 41 },
    { date: "2023-06-11", event: "HYROX New York",  series: "HYROX", format: "Women",             time: "1:20:36", place: 27 },
    { date: "2023-04-22", event: "HYROX Anaheim",   series: "HYROX", format: "Women",             time: "1:22:26", place: 26 },
    { date: "2023-02-11", event: "HYROX Chicago – North American Open Championship", series: "HYROX", format: "Women", time: "1:21:37", place: 49 },
  ],

  // From the family calendar. tentative: true shows a "Tentative" label.
  upcoming: [
    { date: "2026-12-09", event: "Spartan DEKA World Championships", series: "DEKA",  location: "", goal: "Return to the Worlds podium" },
    { date: "2026-12-18", event: "HYROX Vancouver",                  series: "HYROX", location: "Vancouver, BC", tentative: true },
    { date: "2027-03-26", event: "Spartan DEKA Denver",              series: "DEKA",  location: "Denver, CO", goal: "Gold" },
    { date: "2027-05-01", event: "Spartan DEKA Anaheim",             series: "DEKA",  location: "Anaheim, CA" },
    { date: "2027-05-21", event: "HYROX Portland",                   series: "HYROX", location: "Portland, OR", goal: "Home-city race" },
  ],

  // Audience / reach: what sponsors look at first
  audience: {
    summary: "Jamie reaches hybrid athletes, OCR racers, and busy parents who train: the people who buy training gear, nutrition, and recovery products. Her story as a mom racing at the front of her division resonates far beyond the start line.",
    // Instagram stats as of Nov 2026. Engagement = avg likes + comments on the last 12 posts / followers.
    platforms: [
      { name: "Instagram", handle: "@jamielel", url: "https://www.instagram.com/jamielel", metric: "1,040", label: "followers" },
      { name: "Engagement", handle: "Last 12 posts", url: "", metric: "6.3%", label: "engagement rate" },
      { name: "Reels", handle: "Recent average", url: "", metric: "1.1K", label: "views per reel" },
    ],
  },

  // Why partner: value propositions for sponsors
  sponsorValue: [
    { title: "On-course visibility", text: "Your brand at every race: kit, start-line content, and finish-line moments in front of thousands of spectators." },
    { title: "Authentic content", text: "Real training, real races, real results. Product shown where it's actually used: in the sled lane, on the erg, and in recovery." },
    { title: "A growing sport", text: "HYROX and DEKA are among the fastest-growing race formats in fitness. Partner early with an athlete on the way up." },
    { title: "A partner who speaks brand", text: "Jamie has spent nearly 20 years in eCommerce and brand growth, including at Nike and Sony. She knows what a partnership needs to deliver, and she reports on it." },
    { title: "Community reach", text: "Training tips, race recaps, and group workouts that reach the hybrid athletes your brand wants to win." },
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
    { src: "images/deka-airbike.jpg", alt: "Jamie on the air bike at Spartan DEKA Zone 7", position: "center 60%" },
    { src: "images/sled-push.jpg", alt: "Jamie training the sled push" },
  ],

  // Jamie's own Instagram bio line
  instagramBio: "Building Brands between Boarding Passes, Burpees, & Bedtime Stories",

  // Past and current brand partners
  partners: [
    { name: "Nocturne", category: "Sleep supplement", date: "Aug 2026", url: "https://www.instagram.com/reel/Dcbq377JyrP/" },
  ],

  // External links
  sponsorshipReelUrl: "https://www.instagram.com/reel/Dcbq377JyrP/", // Nocturne sleep supplement partnership, Aug 2026 (1,266 views)
  website: { url: "https://www.jamiealee.com/", label: "jamiealee.com", blurb: "JME Labs: eCommerce & growth for consumer brands" },

  // Instagram story highlight of race-day content
  highlightsUrl: "https://www.instagram.com/stories/highlights/17931611258975231/",

  contact: {
    email: "partnerships@example.com", // SAMPLE: replace with Jamie's real email
    instagram: "https://www.instagram.com/jamielel",
  },
};
