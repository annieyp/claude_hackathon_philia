// philía matching engine
// Pure functions. No DOM, no storage. Imported by screens + store.

/* ---------------- vector / set helpers ---------------- */

export function cosineSim(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0, na = 0, nb = 0;
  for (const k of keys) {
    const x = a[k] || 0, y = b[k] || 0;
    dot += x * y; na += x * x; nb += y * y;
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function jaccard(a, b) {
  const A = new Set(a), B = new Set(b);
  if (!A.size && !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

/* ---------------- geo / time ---------------- */

export function haversineKm([lat1, lng1], [lat2, lng2]) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function hoursUntil(date, now = new Date()) {
  return (date.getTime() - now.getTime()) / 36e5;
}

/* ---------------- reliability ---------------- */
// Beta-binomial smoothing. α,β are priors that prevent new users from
// looking either perfect or terrible.

const REL_ALPHA = 2, REL_BETA = 1;

export function reliability({ attended = 0, cancelled = 0, flakes = 0 }) {
  const num = attended + REL_ALPHA;
  const den = attended + cancelled * 0.3 + flakes + REL_ALPHA + REL_BETA;
  return num / den;
}

export function reliabilityBreakdown(history) {
  const r = reliability(history);
  return {
    score: r,
    pct: Math.round(r * 100),
    formula: `(${history.attended} + ${REL_ALPHA}) / (${history.attended} + ${history.cancelled}·0.3 + ${history.flakes} + ${REL_ALPHA + REL_BETA})`,
  };
}

/* ---------------- per-component fits ---------------- */

function vibeFit(user, plan) {
  // plan.vibeTags is a list, user.vibe is a vector. Treat plan as 0/1 vec
  // over the union of keys present in user.vibe ∪ plan.vibeTags.
  const planVec = {};
  for (const t of plan.vibeTags) planVec[t] = 1;
  return cosineSim(user.vibe || {}, planVec);
}

function foodFit(user, plan) {
  const userCuisines = user.cuisinePref || [];
  if (!userCuisines.length) return 0.5;
  return jaccard(userCuisines, [plan.cuisine]) * 2; // single-cuisine plan; double to bring into 0..1
}

function budgetFit(user, plan) {
  const d = Math.abs((user.budget ?? 2) - (plan.budgetTier ?? 2));
  return [1, 0.7, 0.4, 0.15][Math.min(d, 3)];
}

function groupSizeFit(user, plan) {
  const pref = user.groupSizePref || [2, 3, 4];
  return pref.includes(plan.seats) ? 1 : 0.55;
}

function timeFit(user, plan, now = new Date()) {
  const h = hoursUntil(plan.startsAt, now);
  if (h < 0 || h > 6) return 0;
  const start = plan.startsAt.getHours();
  const [lo, hi] = user.timeWindowPref || [17, 22];
  const inWindow = start >= lo && start <= hi ? 1 : 0.5;
  // 6h window decay: prefer plans 1–4h out
  const window = Math.exp(-Math.pow((h - 2.5) / 3, 2));
  return inWindow * window;
}

function distanceFit(user, plan) {
  if (!user.loc || !plan.loc) return 0.6;
  const km = haversineKm(user.loc, plan.loc);
  return Math.exp(-km / 1.2); // ~37% at 1.2km
}

function mutualFit(user, plan, allUsers) {
  const inPlan = plan.filledIds || [];
  if (!inPlan.length) return 0;
  const myConn = new Set(user.connections || []);
  let mutuals = 0;
  for (const uid of inPlan) {
    if (myConn.has(uid)) mutuals += 1;
    const them = allUsers[uid];
    if (them) {
      for (const c of them.connections || []) if (myConn.has(c)) mutuals += 0.25;
    }
  }
  return Math.min(1, mutuals / 3);
}

/* ---------------- combined score ---------------- */

export const WEIGHTS = {
  vibe: 35,
  food: 20,
  budget: 10,
  groupSize: 5,
  time: 10,
  distance: 10,
  mutuals: 10,
};

export function computeMatch(user, plan, ctx = {}) {
  const now = ctx.now || new Date();
  const allUsers = ctx.users || {};
  const fits = {
    vibe: vibeFit(user, plan),
    food: foodFit(user, plan),
    budget: budgetFit(user, plan),
    groupSize: groupSizeFit(user, plan),
    time: timeFit(user, plan, now),
    distance: distanceFit(user, plan),
    mutuals: mutualFit(user, plan, allUsers),
  };
  const breakdown = {};
  let total = 0;
  for (const k of Object.keys(WEIGHTS)) {
    const pts = fits[k] * WEIGHTS[k];
    breakdown[k] = { fit: fits[k], weight: WEIGHTS[k], points: pts };
    total += pts;
  }
  // Reliability of the host nudges the final score (small effect).
  const host = allUsers[plan.hostId];
  const hostRel = host ? reliability(host.history) : 0.9;
  const relAdj = (hostRel - 0.85) * 8; // ±~1.2 pts
  total += relAdj;
  return {
    total: Math.max(0, Math.min(100, Math.round(total))),
    breakdown,
    hostReliability: hostRel,
    relAdj,
  };
}

export function rankPlans(user, plans, ctx) {
  return plans
    .map((p) => ({ plan: p, match: computeMatch(user, p, ctx) }))
    .sort((a, b) => b.match.total - a.match.total);
}

/* ---------------- group composition ----------------
 * Greedy diverse selection: at each step pick the candidate that
 * maximizes individual_match - λ * avg_similarity_to_already_picked.
 * Keeps each seat strong while preventing the bot from filling a plan
 * with 4 carbon copies of the host.
 * ---------------------------------------------------- */

export function suggestGroup(plan, candidates, k, ctx = {}, lambda = 35) {
  const pool = [...candidates];
  const chosen = [];
  const reasons = [];
  while (chosen.length < k && pool.length) {
    let best = null, bestScore = -Infinity, bestIdx = -1, bestIndiv = 0, bestPenalty = 0;
    for (let i = 0; i < pool.length; i++) {
      const c = pool[i];
      const indiv = computeMatch(c, plan, ctx).total;
      const sim = chosen.length
        ? chosen.reduce((s, x) => s + cosineSim(c.vibe || {}, x.vibe || {}), 0) / chosen.length
        : 0;
      const score = indiv - lambda * sim;
      if (score > bestScore) {
        bestScore = score; best = c; bestIdx = i; bestIndiv = indiv; bestPenalty = lambda * sim;
      }
    }
    chosen.push(best);
    reasons.push({ user: best, indiv: bestIndiv, diversityPenalty: bestPenalty, marginal: bestScore });
    pool.splice(bestIdx, 1);
  }
  return { chosen, reasons };
}

/* ---------------- bot ---------------- */
// Bot drives the plan from open → locked → vibecheck → enroute → wrapup.
// Returns the schedule of events relative to startsAt.

export function botSchedule(plan) {
  const t = plan.startsAt.getTime();
  return [
    { at: new Date(plan.createdAt || t - 6 * 36e5), stage: "recruiting", text: "matching candidates" },
    { at: new Date(t - 60 * 60e3), stage: "locked", text: "lock seats — final roster" },
    { at: new Date(t - 30 * 60e3), stage: "vibecheck", text: "vibe-check ping (🟢/🟡/🔴)" },
    { at: new Date(t - 5 * 60e3), stage: "enroute", text: "directions + ETA share" },
    { at: new Date(t + 90 * 60e3), stage: "wrapup", text: "rate plan, optionally swap contacts" },
  ];
}

export function botStageNow(plan, now = new Date()) {
  const sched = botSchedule(plan);
  let cur = sched[0];
  for (const ev of sched) if (ev.at <= now) cur = ev;
  return cur;
}

export function botSummary(user, plan, allUsers, ctx = {}) {
  const m = computeMatch(user, plan, { ...ctx, users: allUsers });
  const top = Object.entries(m.breakdown)
    .sort((a, b) => b[1].points - a[1].points)
    .slice(0, 3);
  const host = allUsers[plan.hostId];
  const hostRel = host ? Math.round(reliability(host.history) * 100) : 90;
  const split = plan.budgetPerPerson
    ? `~$${plan.budgetPerPerson} per person`
    : "split tbd";
  const why = top
    .map(([k, v]) => `${k} ${Math.round(v.points)}/${v.weight}`)
    .join(" · ");
  return `${m.total}% match. Strongest signals: ${why}. Host ${host?.name || "?"} ${hostRel}% reliable. ${split}.`;
}
