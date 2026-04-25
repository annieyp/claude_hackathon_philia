import { botThread } from "./mock.js";
import {
  computeMatch,
  rankPlans,
  reliability,
  reliabilityBreakdown,
  suggestGroup,
  botSchedule,
  botStageNow,
  botSummary,
  WEIGHTS,
  hoursUntil,
  haversineKm,
} from "./engine.js";
import {
  me,
  userById,
  allUsers,
  listPlans,
  planById,
  friendsOfMe,
} from "./store.js";

/* ---------- shared chrome ---------- */
const statusbar = () => /*html*/ `
  <div class="statusbar">
    <span>9:41</span>
    <span class="statusbar__notch"></span>
    <span class="statusbar__signal">●●●●  ◔  ▮▮</span>
  </div>`;

const header = ({ left = "", center = "", right = "" } = {}) => /*html*/ `
  <div class="row row--between" style="padding: 4px 2px;">
    <div class="row gap-md">${left}</div>
    <div class="hand" style="font-size:22px;">${center}</div>
    <div class="row gap-md">${right}</div>
  </div>`;

const back = (href = "#/home") =>
  `<a class="iconbtn" href="${href}" aria-label="Back">←</a>`;

/* =====================================================
   ONBOARDING — A · Manifesto
   ===================================================== */
export function renderOnboarding() {
  return /*html*/ `
  ${statusbar()}
  <div class="manifesto">
    <div>
      <h1 class="manifesto__greek"><span class="brand">philía</span></h1>
      <div class="manifesto__def">n. — affectionate friendship</div>
    </div>
    <h2 class="manifesto__h">Dinner with strangers, <span class="squiggle">tonight</span>.</h2>
    <p class="manifesto__sub">
      Drop a plan. Find one. Eat together within the next 6 hours.
      No DMs, no schedule juggling — a bot does that.
    </p>

    <div class="chip-row">
      <span class="chip chip--soft">⏱ next 6h</span>
      <span class="chip chip--soft">👥 2–6 ppl</span>
      <span class="chip chip--soft">🎓 .edu verified</span>
      <span class="chip chip--soft">🤖 bot middleman</span>
    </div>

    <div class="howitworks">
      <div class="eyebrow">how it works</div>
      <div class="howitworks__row"><span class="howitworks__num">1.</span><span>You drop a plan, or join one.</span></div>
      <div class="howitworks__row"><span class="howitworks__num">2.</span><span>Bot picks 2–6 verified students.</span></div>
      <div class="howitworks__row"><span class="howitworks__num">3.</span><span>Show up. No phone numbers exchanged.</span></div>
    </div>

    <div class="stack" style="margin-top:6px;">
      <a class="btn btn--primary" href="#/onboard/vibe">Sign in with school email →</a>
      <a class="btn btn--ghost" href="#/onboard/vibe">new here? <span class="squiggle">make a profile</span></a>
      <a class="btn btn--ghost" href="#/algo">see how matching works ›</a>
    </div>
  </div>`;
}

/* =====================================================
   ONBOARDING — Avatar swarm
   ===================================================== */
export function renderOnboardSwarm() {
  return /*html*/ `
  ${statusbar()}
  <div class="stepper__row">
    <span class="eyebrow">step 2 / 3</span>
    <a class="muted tiny" href="#/onboard/vibe">skip ›</a>
  </div>
  <div class="stepper">
    <div class="stepper__bar is-done"></div>
    <div class="stepper__bar is-done"></div>
    <div class="stepper__bar"></div>
  </div>

  <div class="swarm">
    <div class="swarm__node tilt-1" style="top:10px;left:30px;">🍜</div>
    <div class="swarm__node tilt-2" style="top:0;left:140px;">🎧</div>
    <div class="swarm__node tilt-3" style="top:30px;left:240px;">🌿</div>
    <div class="swarm__node tilt-1" style="top:120px;left:60px;">📚</div>
    <div class="swarm__node tilt-2" style="top:140px;left:170px;">☕</div>
    <div class="swarm__node tilt-3" style="top:110px;left:260px;">🎬</div>
    <svg class="map__path" viewBox="0 0 320 220" preserveAspectRatio="none">
      <path d="M62,42 C100,80 160,30 200,54 S 280,140 200,150" stroke="#E16D5C" stroke-width="1.5" fill="none" stroke-dasharray="3 4"/>
      <path d="M92,150 C140,180 180,120 240,140" stroke="#E16D5C" stroke-width="1.5" fill="none" stroke-dasharray="3 4"/>
    </svg>
  </div>

  <h2 class="h-display">Built for Cornell, by <span class="squiggle">Cornell</span>.</h2>
  <p class="muted">Everyone here verified their .edu. You'll see majors, year, vibe tags — and a reliability score so flakers stand out.</p>

  <div class="row gap-sm">
    <span class="chip chip--check chip--soft" style="border-color: var(--accent); color: var(--accent);">.EDU ONLY</span>
    <span class="muted tiny">· no random adults</span>
  </div>

  <div class="row gap-md">
    <a href="#/onboard" class="btn btn--ghost">Back</a>
    <a href="#/onboard/vibe" class="btn btn--primary">Continue</a>
  </div>`;
}

/* =====================================================
   ONBOARDING — Vibe picker
   ===================================================== */
export function renderOnboardVibe() {
  return /*html*/ `
  ${statusbar()}
  <div class="stepper__row">
    <span class="eyebrow">step 3 / 3</span>
  </div>
  <div class="stepper">
    <div class="stepper__bar is-done"></div>
    <div class="stepper__bar is-done"></div>
    <div class="stepper__bar is-done"></div>
  </div>

  <h2 class="hand" style="font-size:30px;line-height:1;">What's your vibe?</h2>
  <p class="muted">Pick 4+ — these become your vibe vector for the matching engine.</p>

  <div class="card row" style="padding:12px 14px;">
    <div class="avatar avatar--lg">🌶</div>
    <div class="col" style="flex:1;">
      <div class="h-md">Maya K.</div>
      <div class="muted tiny">Junior · ILR · she/her</div>
    </div>
    <button class="chip chip--soft">edit</button>
  </div>

  <div class="chip-row">
    ${checkChip("ramen", true)} ${checkChip("boba", true)} ${checkChip("vegetarian", false)} ${checkChip("quiet", false)}
    ${checkChip("loud", true)} ${checkChip("cheap eats", true)} ${checkChip("try new spots", true)}
    ${checkChip("sushi", false)} ${checkChip("pizza", false)} ${checkChip("coffee", true)} ${checkChip("post-class", true)}
    ${checkChip("late night", false)} <span class="chip chip--soft" style="border-style:dashed;">+ add</span>
  </div>

  <div class="divider"></div>
  <div class="eyebrow">budget range</div>
  <div class="chip-row">
    ${checkChip("$", true)}
    ${checkChip("$$", true)}
    ${checkChip("$$$", false)}
    ${checkChip("$$$$", false)}
  </div>

  <div class="eyebrow">group size I like</div>
  <div class="chip-row">
    ${checkChip("2", true)}
    ${checkChip("3", true)}
    ${checkChip("4", false)}
    ${checkChip("5", false)}
    ${checkChip("6", false)}
  </div>

  <a href="#/home" class="btn btn--primary">Find dinner tonight  →</a>`;
}

/* =====================================================
   HOME  (live-ranked plans)
   ===================================================== */
export function renderHome() {
  const u = me();
  const ctx = { users: allUsers(), now: new Date() };
  const ranked = rankPlans(u, listPlans(), ctx);
  return /*html*/ `
  ${statusbar()}
  ${header({
    left: `<div class="hand" style="font-size:22px;">tonight</div>`,
    right: `<span class="muted tiny">${ranked.length} plans · 6h window</span>`,
  })}

  <div class="row gap-md">
    <a href="#/start" class="btn btn--primary" style="flex:1;">+ Start</a>
    <label class="search">
      <span>🔎</span>
      <input placeholder="Join near me" />
    </label>
  </div>

  <div class="row row--between">
    <div class="eyebrow">happening soon</div>
    <a class="muted tiny" href="#/algo">why these? ›</a>
  </div>
  <div class="stack gap-md">
    ${ranked.map(({ plan, match }) => planCard(plan, match)).join("")}
  </div>

  <div class="card card--paper" style="margin-top:6px;">
    <div class="eyebrow">people you've eaten with</div>
    <div class="row gap-sm">
      ${friendsOfMe()
        .map(
          (f) => `
        <div class="col" style="align-items:center;">
          <div class="avatar avatar--lg">${f.emoji}</div>
          <span class="tiny muted">${f.name}</span>
        </div>`
        )
        .join("")}
    </div>
  </div>`;
}

function planCard(p, match) {
  const host = userById(p.hostId);
  const open = p.seats - p.filledIds.length;
  return /*html*/ `
  <a href="#/plan/${p.id}" class="plancard">
    <div class="plancard__head">
      <div class="col">
        <div class="plancard__title">${p.spot}</div>
        <div class="plancard__meta">${fmtTime(p.startsAt)} · ${fmtIn(p.startsAt)} · ${p.location}</div>
      </div>
      <span class="plancard__more">${open} open</span>
    </div>
    <div class="chip-row">
      ${p.vibeTags.map((t) => `<span class="chip chip--soft">${t}</span>`).join("")}
    </div>
    <div class="plancard__foot">
      <div class="plancard__host">
        <div class="avatar" style="width:24px;height:24px;font-size:14px;">${host.emoji}</div>
        hosted by <strong>${host.name}</strong> · ${p.filledIds.length}/${p.seats}
      </div>
      <div class="match"><span class="hand">${match.total}%</span> <span class="match__label">match</span></div>
    </div>
  </a>`;
}

/* =====================================================
   START A PLAN
   ===================================================== */
export function renderStart() {
  const u = me();
  const candidates = Object.values(allUsers()).filter((c) => c.id !== u.id);
  // Preview group for a hypothetical 4-seat plan with the user's pref tags.
  const hypo = {
    id: "preview",
    hostId: u.id,
    cuisine: "ramen",
    vibeTags: ["chill", "study-after"],
    budgetTier: u.budget,
    seats: 4,
    filledIds: [u.id],
    startsAt: (() => {
      const d = new Date();
      d.setHours(19, 0, 0, 0);
      return d;
    })(),
    loc: u.loc,
  };
  const { reasons } = suggestGroup(hypo, candidates, 3, { users: allUsers() });
  const avgRel =
    Math.round(
      (reasons.reduce((s, r) => s + reliability(r.user.history), 0) / reasons.length) * 100
    ) || 0;

  return /*html*/ `
  ${statusbar()}
  ${header({
    left: `<a href="#/home" class="iconbtn">✕</a>`,
    center: "new plan",
  })}

  <div class="inlineform">
    I want to grab
    <span class="inlineform__chip" data-field="cuisine">ramen</span>
    at
    <span class="inlineform__chip" data-field="spot">Mehak's</span>
    around
    <span class="inlineform__chip" data-field="time">7:00 pm</span>
    with
    <span class="inlineform__chip" data-field="seats">3 people</span>
    · budget
    <span class="inlineform__chip" data-field="budget">$$</span>.
  </div>

  <div class="eyebrow">vibe (pick 1–3)</div>
  <div class="chip-row">
    <span class="chip chip--accent">chill</span>
    <span class="chip chip--accent">study after</span>
    <span class="chip chip--soft">loud</span>
    <span class="chip chip--soft">first dates ok</span>
    <span class="chip chip--soft">quiet</span>
    <span class="chip chip--accent">friend group</span>
  </div>

  <div class="eyebrow">note to joiners (optional)</div>
  <textarea class="field" rows="3" id="plan-note">craving a hot soup after the prelim 😮‍💨</textarea>

  <div class="card card--tint">
    <div class="eyebrow">bot will find</div>
    <div class="hand" style="font-size:24px;">~${reasons.length} strong matches</div>
    <div class="muted tiny">verified · avg reliability ${avgRel}% · greedy diverse selection</div>
  </div>

  <div class="card" style="padding:12px 14px;">
    <div class="row gap-md">
      <div class="avatar-stack">
        ${reasons
          .map(
            (r) => `<div class="avatar" title="${r.user.name} (${Math.round(r.indiv)}%)">${r.user.emoji}</div>`
          )
          .join("")}
      </div>
      <div class="col" style="flex:1;">
        <div class="tiny"><strong>${reasons.map((r) => r.user.name).join(", ")}</strong></div>
        <div class="tiny muted">avg match ${Math.round(reasons.reduce((s, r) => s + r.indiv, 0) / reasons.length)}% · diversity-penalized greedy</div>
      </div>
    </div>
  </div>

  <div class="row gap-md" style="align-items:flex-start;">
    <span class="muted tiny" style="flex:1;">you'll only show as host. bot handles intros.</span>
    <button class="btn btn--primary" style="width:auto;padding:12px 18px;" data-action="drop">Drop plan ▷</button>
  </div>
  <div class="muted tiny center">auto-cancels if not full by 6:55pm</div>`;
}

/* =====================================================
   JOIN A PLAN
   ===================================================== */
export function renderJoin() {
  const u = me();
  const ctx = { users: allUsers(), now: new Date() };
  const ranked = rankPlans(u, listPlans(), ctx).slice(0, 3);
  return /*html*/ `
  ${statusbar()}
  ${header({
    left: `${back()}`,
    right: `<a class="iconbtn" href="#/home">⌕</a>`,
  })}

  <div class="row gap-md">
    <label class="search">
      <span>🔎</span>
      <input placeholder="ramen, vegetarian, $$ …" value="ramen, vegetarian, $$" />
    </label>
    <button class="iconbtn">⏷</button>
  </div>

  ${sketchyMap(true)}

  <div class="row row--between">
    <div class="hand" style="font-size:22px;">${ranked.length} matches near you</div>
    <span class="muted tiny">SORT: ai ▾</span>
  </div>

  <div class="stack gap-md">
    ${ranked.map(({ plan, match }) => rankedRow(plan, match)).join("")}
  </div>`;
}

function rankedRow(p, match) {
  return /*html*/ `
  <a href="#/plan/${p.id}" class="card" style="padding:12px 14px;">
    <div class="row gap-md">
      <div class="col" style="align-items:center;width:48px;">
        <span class="hand" style="font-size:24px;color:var(--accent);">${match.total}%</span>
        <span class="muted tiny" style="letter-spacing:1px;">match</span>
      </div>
      <div class="col" style="flex:1;">
        <div class="row row--between">
          <strong>${p.spot}</strong>
          <span class="muted tiny">${fmtTime(p.startsAt)}</span>
        </div>
        <div class="muted tiny">↳ top: ${topReasons(match.breakdown)}</div>
        <div class="chip-row" style="margin-top:6px;">
          ${p.vibeTags.map((t) => `<span class="chip chip--soft">${t}</span>`).join("")}
        </div>
      </div>
      <span class="badge">${p.seats - p.filledIds.length} open</span>
    </div>
  </a>`;
}

function topReasons(breakdown) {
  return Object.entries(breakdown)
    .sort((a, b) => b[1].points - a[1].points)
    .slice(0, 2)
    .map(([k]) => k)
    .join(" + ");
}

/* =====================================================
   MAP
   ===================================================== */
export function renderMap() {
  const ranked = rankPlans(me(), listPlans(), { users: allUsers() });
  return /*html*/ `
  ${statusbar()}
  ${header({
    left: `${back()}<label class="search"><span>🔎</span><input placeholder="nearby plans" /></label>`,
    right: `<button class="iconbtn">≡</button>`,
  })}

  ${sketchyMap(false)}

  <div class="card card--paper" style="margin-top:-6px;">
    <div class="row row--between">
      <div class="col">
        <div class="eyebrow">next 6h</div>
        <div class="row gap-sm"><span class="dot dot--accent"></span><span class="tiny">active group</span></div>
        <div class="row gap-sm"><span class="dot" style="background:#2a73d4;"></span><span class="tiny">you</span></div>
      </div>
      <div class="col" style="text-align:right;">
        <span class="hand" style="font-size:22px;color:var(--accent);">${ranked.length} plans</span>
        <span class="muted tiny">in 6h window</span>
      </div>
    </div>
  </div>`;
}

function sketchyMap(small) {
  return /*html*/ `
  <div class="map ${small ? "map--sm" : ""}">
    <span class="map__label" style="top:14px;left:18px;">North Campus</span>
    <span class="map__label" style="top:54%;left:24px;">Collegetown</span>
    <span class="map__label" style="bottom:12px;right:18px;">Commons</span>

    <svg class="map__path" viewBox="0 0 360 360" preserveAspectRatio="none">
      <path d="M-10,80 C100,30 220,140 380,90" stroke="#1a1a1a" stroke-opacity=".18" fill="none" stroke-width="1.5"/>
      <path d="M-10,210 C120,180 260,260 380,220" stroke="#1a1a1a" stroke-opacity=".18" fill="none" stroke-width="1.5"/>
      <path d="M40,-10 C90,80 50,200 120,380" stroke="#1a1a1a" stroke-opacity=".12" fill="none" stroke-width="1.5"/>
    </svg>

    <span class="map__pin" style="top:32%;left:32%;">🌿 Mehak <span class="map__pinbadge">3</span></span>
    <span class="map__pin" style="top:60%;left:60%;">🎧 Koko <span class="map__pinbadge">2</span></span>
    <span class="map__pin" style="top:78%;left:30%;">🍜 Saigon <span class="map__pinbadge">2</span></span>
    <span class="map__pin" style="top:42%;left:72%;">📚 CTB <span class="map__pinbadge">1</span></span>
    <span class="map__you" style="top:64%;left:42%;"></span>

    <div class="map__legend">
      <div class="map__legend-row"><span class="dot dot--accent"></span> active group</div>
      <div class="map__legend-row"><span class="dot" style="background:#2a73d4;"></span> you</div>
    </div>
  </div>`;
}

/* =====================================================
   PLAN DETAIL  (live engine output)
   ===================================================== */
export function renderPlan() {
  const id = location.hash.split("/").pop();
  const p = planById(id) || listPlans()[0];
  const u = me();
  const ctx = { users: allUsers(), now: new Date() };
  const m = computeMatch(u, p, ctx);
  const host = userById(p.hostId);
  const stage = botStageNow(p);
  const km = u.loc && p.loc ? haversineKm(u.loc, p.loc) : null;

  const roster = p.filledIds.map((uid) => {
    const r = userById(uid);
    const rel = Math.round(reliability(r.history) * 100);
    return /*html*/ `
      <div class="roster__row">
        <div class="avatar">${r.emoji}</div>
        <div class="col" style="flex:1;">
          <div class="roster__name">${r.name}${uid === p.hostId ? ` <span class="muted tiny">(host)</span>` : ""}</div>
          <div class="roster__sub">${r.year} · ${r.major} · ${rel}% reliable</div>
        </div>
        <span class="chip chip--soft tiny">${rel}%</span>
      </div>`;
  });
  const open = p.seats - p.filledIds.length;
  for (let i = 0; i < open; i++) {
    roster.push(/*html*/ `
      <div class="roster__row">
        <div class="avatar" style="border-style:dashed;">?</div>
        <div class="col" style="flex:1;">
          <div class="roster__name">open</div>
          <div class="roster__sub">${i === 0 ? "1 spot left — could be you" : "open seat"}</div>
        </div>
      </div>`);
  }
  const iAmIn = p.filledIds.includes(u.id);

  return /*html*/ `
  ${statusbar()}
  ${header({
    left: `${back()}`,
    right: `<span class="chip chip--soft">⊕ verified</span>`,
  })}

  <div class="hero">
    <div class="hero__match">${m.total}% MATCH</div>
    <div class="hero__eyebrow">TONIGHT · ${fmtIn(p.startsAt)}</div>
    <h2 class="hero__title">${p.spot}</h2>
    <div class="muted">${fmtTime(p.startsAt)} · ${km ? km.toFixed(1) + " km" : "nearby"} · ${p.location}</div>
    <div class="chip-row" style="margin-top:8px;">
      ${p.vibeTags.map((t) => `<span class="chip chip--soft">${t}</span>`).join("")}
    </div>
  </div>

  <div class="card">
    <div class="row row--between">
      <div class="eyebrow">why ${m.total}%</div>
      <a href="#/algo/${p.id}" class="muted tiny">see math ›</a>
    </div>
    ${breakdownBars(m.breakdown)}
    <div class="muted tiny">+ host reliability adj ${m.relAdj >= 0 ? "+" : ""}${m.relAdj.toFixed(1)}</div>
  </div>

  <div class="eyebrow">who's coming (${p.filledIds.length} / ${p.seats})</div>
  <div class="card roster">
    ${roster.join("")}
  </div>

  <div class="callout">
    <div class="callout__title">🤖 bot summary</div>
    ${botSummary(u, p, allUsers())}
    <div class="muted tiny" style="margin-top:6px;">stage: <strong>${stage.stage}</strong> — ${stage.text}</div>
  </div>

  <div class="row gap-md">
    ${
      iAmIn
        ? `<button class="btn btn--ghost" data-action="leave" data-plan="${p.id}">Leave</button>
           <a href="#/chat" class="btn btn--primary">Open thread →</a>`
        : `<a href="#/home" class="btn btn--ghost">Pass</a>
           <button class="btn btn--primary" data-action="claim" data-plan="${p.id}">Join — claim seat →</button>`
    }
  </div>
  <div class="muted tiny center">tap join → bot intros you. takes ~20 seconds.</div>`;
}

/* =====================================================
   ALGO  (how matching works)
   ===================================================== */
export function renderAlgo() {
  const u = me();
  const ctx = { users: allUsers(), now: new Date() };
  const ranked = rankPlans(u, listPlans(), ctx);
  const id = location.hash.split("/")[2];
  const focus = id ? planById(id) : ranked[0]?.plan;
  if (!focus) return `${statusbar()}<p>No plan to explain.</p>`;
  const m = computeMatch(u, focus, ctx);
  const host = userById(focus.hostId);
  const rb = reliabilityBreakdown(host.history);

  const sched = botSchedule(focus);
  const now = new Date();

  return /*html*/ `
  ${statusbar()}
  ${header({ left: back(`#/plan/${focus.id}`), center: "the math" })}

  <div class="card card--tint">
    <div class="eyebrow">scoring</div>
    <p class="muted tiny" style="margin:0;">
      Each plan is scored against your profile across ${Object.keys(WEIGHTS).length} components.
      Components are weighted, summed, then nudged by host reliability.
    </p>
    ${breakdownBars(m.breakdown)}
    <div class="row row--between" style="border-top:1px dashed var(--line-soft);padding-top:8px;">
      <div class="eyebrow">total</div>
      <div class="hand" style="font-size:24px;color:var(--accent);">${m.total}%</div>
    </div>
  </div>

  <div class="card">
    <div class="eyebrow">component definitions</div>
    <ul class="defs">
      <li><strong>vibe (${WEIGHTS.vibe})</strong> — cosine similarity between your vibe vector and the plan's tag vector.</li>
      <li><strong>food (${WEIGHTS.food})</strong> — Jaccard overlap of your cuisine prefs with the plan cuisine.</li>
      <li><strong>budget (${WEIGHTS.budget})</strong> — distance between your $-tier and the plan's, decayed.</li>
      <li><strong>groupSize (${WEIGHTS.groupSize})</strong> — full credit if the plan size is in your preferred set.</li>
      <li><strong>time (${WEIGHTS.time})</strong> — Gaussian centered at 2.5h out, gated to your dinner-hour window.</li>
      <li><strong>distance (${WEIGHTS.distance})</strong> — exponential decay over haversine km.</li>
      <li><strong>mutuals (${WEIGHTS.mutuals})</strong> — direct + 2nd-degree connections in the roster.</li>
    </ul>
  </div>

  <div class="card">
    <div class="eyebrow">host reliability</div>
    <div class="row gap-md">
      <div class="relring"><span class="relring__num">${rb.pct}%</span></div>
      <div class="col">
        <div class="muted tiny">${host.name}'s history: ${host.history.attended} attended · ${host.history.cancelled} cancelled · ${host.history.flakes} flakes</div>
        <div class="tiny" style="font-family:ui-monospace,Menlo,monospace;">rel = ${rb.formula}</div>
        <div class="muted tiny">Beta-binomial smoothing keeps a brand-new host from looking either perfect or radioactive.</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="eyebrow">group composition</div>
    <p class="muted tiny" style="margin:0;">
      To fill open seats, the bot uses a greedy diverse selection:
      pick the candidate that maximizes <em>individual match − λ · avg cosine similarity to already-picked</em>.
      That keeps each seat strong without producing a roster of clones.
    </p>
  </div>

  <div class="card">
    <div class="eyebrow">bot schedule</div>
    <ul class="defs">
      ${sched
        .map(
          (s) => `
        <li>
          <strong>${s.stage}</strong> — ${s.text}
          <span class="muted tiny">${s.at <= now ? "✓ done · " : ""}${fmtTime(s.at)}</span>
        </li>`
        )
        .join("")}
    </ul>
  </div>`;
}

/* =====================================================
   CHAT
   ===================================================== */
export function renderChat() {
  return /*html*/ `
  ${statusbar()}
  <div class="chathead">
    <div class="row gap-md">
      ${back()}
      <div class="col">
        <div class="chathead__title">Mehak Indian · 7pm</div>
        <div class="chathead__sub">Nico, Avi, Priya, you · bot mediated</div>
      </div>
    </div>
    <span class="chip chip--soft">⊕ safe</span>
  </div>

  <div class="row gap-sm" style="margin-top:-4px;">
    <div class="avatar" style="width:26px;height:26px;font-size:14px;">🌿</div>
    <div class="avatar" style="width:26px;height:26px;font-size:14px;">🎧</div>
    <div class="avatar" style="width:26px;height:26px;font-size:14px;">🍓</div>
    <div class="avatar" style="width:26px;height:26px;font-size:14px;">🌶</div>
  </div>

  <div class="chat">
    ${botThread
      .map((m) => {
        if (m.kind === "tag") return `<div class="timeline-tag">${m.text}</div>`;
        if (m.kind === "me")
          return `<div class="bubble bubble--me">${m.text}</div>`;
        if (m.kind === "bot-mini")
          return `<div class="bubble bubble--bot" style="font-size:13px;color:var(--ink-3);">${m.text}</div>`;
        if (m.kind === "tip")
          return `<div class="bubble bubble--bot" style="background:var(--accent-tint); border-style:dashed;">${m.text}</div>`;
        return `
          <div class="bubble bubble--bot">
            <div class="bubble__from">🤖 philia bot</div>
            ${m.text}
            ${
              m.actions
                ? `<div class="replies">${m.actions
                    .map((a) => `<span class="chip chip--soft">${a}</span>`)
                    .join("")}</div>`
                : ""
            }
          </div>`;
      })
      .join("")}
  </div>

  <div class="eyebrow" style="margin-top:6px;">quick replies</div>
  <div class="chip-row">
    <span class="chip chip--soft">👍 ok</span>
    <span class="chip chip--soft">👎 nope</span>
    <span class="chip chip--soft">running late</span>
    <span class="chip chip--soft">swap contacts</span>
    <span class="chip chip--soft">wrap up</span>
  </div>

  <div class="composer">
    <input placeholder="tell the bot…" />
    <button aria-label="Send">▷</button>
  </div>`;
}

/* =====================================================
   PROFILE
   ===================================================== */
export function renderProfile() {
  const u = me();
  const rb = reliabilityBreakdown(u.history);
  return /*html*/ `
  ${statusbar()}
  ${header({
    left: `${back()}`,
    right: `<a class="muted tiny" href="#/me">edit</a>`,
  })}

  <div class="proheader">
    <div class="avatar avatar--xl tilt-1">${u.emoji}</div>
    <div class="hand" style="font-size:34px;line-height:1;">${u.name}</div>
    <div class="muted">${u.year} · ${u.major} · ${u.pronouns || "—"} · ${u.age || "—"}</div>
    <div class="row gap-sm" style="margin-top:6px;">
      <span class="chip chip--soft chip--check">.edu verified</span>
      <span class="chip chip--soft chip--check">${u.history.attended + u.history.cancelled} dinners</span>
    </div>
  </div>

  <div class="relcallout">
    <div class="relring" style="background: conic-gradient(var(--accent) ${rb.pct}%, #fff ${rb.pct}% 100%);"><span class="relring__num">${rb.pct}%</span></div>
    <div class="col">
      <div class="eyebrow">reliability</div>
      <div class="muted tiny">${u.history.attended} attended · ${u.history.cancelled} cancelled · ${u.history.flakes} flakes</div>
      <div class="tiny" style="font-family:ui-monospace,Menlo,monospace;">${rb.formula}</div>
    </div>
  </div>

  <div class="callout">
    💭 ${u.bio || ""}
  </div>

  <div class="eyebrow">food</div>
  <div class="chip-row">
    ${(u.food || []).map((f) => `<span class="chip chip--soft">${f}</span>`).join("")}
  </div>

  <div class="eyebrow">vibe vector</div>
  <div class="chip-row">
    ${Object.entries(u.vibe || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([k, v]) => `<span class="chip ${v >= 0.7 ? "chip--accent" : "chip--soft"}">${k} ${v.toFixed(1)}</span>`)
      .join("")}
  </div>

  <div class="row gap-md">
    <div class="col" style="flex:1;">
      <div class="eyebrow">budget</div>
      <span class="chip chip--accent" style="align-self:flex-start;">${"$".repeat(u.budget || 2)}</span>
    </div>
    <div class="col" style="flex:1;">
      <div class="eyebrow">group size</div>
      <span class="chip chip--soft" style="align-self:flex-start;">${(u.groupSizePref || []).join(", ")} people</span>
    </div>
  </div>

  <div class="eyebrow">past connections · ${(u.connections || []).length}</div>
  <div class="row gap-sm">
    ${(u.connections || [])
      .map((id) => userById(id))
      .filter(Boolean)
      .map((f) => `<div class="avatar" title="${f.name}">${f.emoji}</div>`)
      .join("")}
  </div>`;
}
