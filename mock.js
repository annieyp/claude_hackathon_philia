// Mock data for the philía wireframe demo.

export const me = {
  name: "Maya K.",
  emoji: "🌶",
  year: "Junior",
  major: "ILR",
  pronouns: "she/her",
  age: 21,
  reliability: 96,
  attended: 22,
  flakes: 0,
  cancelled: 1,
  connections: 17,
  bio:
    "craving spice + soup. studying law-econ. I will absolutely talk your ear off about live music.",
  food: ["ramen", "indian", "korean", "boba", "vegetarian-ok", "no oysters"],
  vibe: ["chill", "post-class", "study-after", "first-dates ok"],
  budget: "$$",
  groupSize: "2–4",
};

export const friends = [
  { name: "Sam", emoji: "🐝" },
  { name: "Jules", emoji: "🌊" },
  { name: "Priya", emoji: "🍓" },
  { name: "Nico", emoji: "🌿" },
  { name: "Wen", emoji: "🦊" },
];

export const plans = [
  {
    id: "p1",
    spot: "Mehak Indian Cuisine",
    cuisine: "indian",
    emoji: "🌿",
    time: "6:30 pm",
    distanceLabel: "in 48m · 4 min walk",
    location: "College Town",
    tags: ["indian", "$$", "chill"],
    host: { name: "Nico", emoji: "🌿", reliability: 100 },
    filled: 3,
    seats: 4,
    match: 98,
    more: 1,
  },
  {
    id: "p2",
    spot: "Koko Korean BBQ",
    cuisine: "kbbq",
    emoji: "🎧",
    time: "7:00 pm",
    distanceLabel: "in 1h 18m · College Town",
    location: "College Town",
    tags: ["kbbq", "$$$", "loud"],
    host: { name: "Avi", emoji: "🎧", reliability: 96 },
    filled: 2,
    seats: 4,
    match: 94,
    more: 2,
  },
  {
    id: "p3",
    spot: "Collegetown Bagels",
    cuisine: "bagels",
    emoji: "📚",
    time: "9:30 pm",
    distanceLabel: "late · 2 min walk",
    location: "Collegetown",
    tags: ["cheap", "study", "quiet"],
    host: { name: "Reni", emoji: "📚", reliability: 92 },
    filled: 1,
    seats: 4,
    match: 91,
    more: 3,
  },
  {
    id: "p4",
    spot: "Saigon Kitchen",
    cuisine: "vietnamese",
    emoji: "🍜",
    time: "8:00 pm",
    distanceLabel: "5 min walk",
    location: "Collegetown",
    tags: ["vietnamese", "$$"],
    host: { name: "Lin", emoji: "🍜", reliability: 89 },
    filled: 2,
    seats: 4,
    match: 88,
    more: 1,
  },
];

// Plan-detail roster for the featured plan
export const featuredPlan = {
  id: "p1",
  spot: "Mehak Indian Cuisine",
  time: "7:00 pm",
  in: "in 1h 18m",
  walk: "4 min walk",
  tags: ["indian", "$$", "chill", "post-class"],
  match: 98,
  budgetPerPerson: 22,
  group: { filled: 3, seats: 4 },
  roster: [
    {
      emoji: "🌿",
      name: "Nico",
      role: "host",
      sub: "Junior · CS · 100% reliable",
      tag: "2 mutuals",
    },
    {
      emoji: "🎧",
      name: "Avi",
      sub: "Sophomore · ILR · 96% reliable",
      tag: "1 mutual",
    },
    {
      emoji: "🍓",
      name: "Priya",
      sub: "Junior · Bio · 92% reliable",
      tag: "new face",
    },
    { emoji: "?", name: "open", sub: "1 spot left — could be you", open: true },
  ],
  summary:
    "Solid match — your last 2 plans were Indian, Nico hosts a lot (zero flakes), Avi shares your “post-class chill” tag. Rough split ~$22 per person.",
};

// Group bot thread messages
export const botThread = [
  {
    kind: "bot",
    text: "Plan locked. 4/4 confirmed for Mehak's, 7:00 pm. I'll nudge again at 6:30.",
  },
  { kind: "tag", text: "— 6:30 pm —" },
  {
    kind: "bot",
    text: "Vibe check 🫶 — react below.",
    actions: ["🟢 still in", "🟡 running 5", "🔴 can't make it"],
  },
  { kind: "me", text: "🟢 still in" },
  { kind: "bot-mini", text: "3 / 4 in. Waiting on Avi…" },
  {
    kind: "bot",
    text: "Avi's running 5. Pushing meetup to 7:05. Cool with everyone? 👍 / 👎",
  },
  {
    kind: "tip",
    text: "Pro tip: bot keeps numbers private. Want to share yours after? Say “swap contacts”.",
  },
];

export const nearbyTags = ["🍜", "🎧", "🌿", "📚", "☕", "+ 9 more"];
