import {
  me,
  friends,
  plans,
  featuredPlan,
  botThread,
  nearbyTags,
} from "./mock.js";

/* ---------- shared chrome ---------- */
const statusbar = (right = "STEP") => /*html*/ `
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

const checkChip = (label, checked = false) => /*html*/ `
  <label class="checkchip">
    <input class="checkchip__input" type="checkbox" ${checked ? "checked" : ""} />
    <span class="checkchip__ui">
      <span class="checkchip__mark" aria-hidden="true"></span>
      <span class="checkchip__text">${label}</span>
    </span>
  </label>`;

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
    </div>
  </div>`;
}

/* =====================================================
   ONBOARDING — Avatar swarm (step 2)
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
   ONBOARDING — Vibe picker (step 3)
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
  <p class="muted">Pick 4+ — the AI uses these to match you.</p>

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
   HOME
   ===================================================== */
export function renderHome() {
  return /*html*/ `
  ${statusbar()}
  ${header({
    left: `<div class="hand" style="font-size:22px;">tonight</div>`,
    right: `<span class="muted tiny">${plans.length} plans · 6h window</span>`,
  })}

  <div class="row gap-md">
    <a href="#/start" class="btn btn--primary" style="flex:1;">+ Start</a>
    <label class="search">
      <span>🔎</span>
      <input placeholder="Join near me" />
    </label>
  </div>

  <div class="eyebrow">happening soon</div>
  <div class="stack gap-md">
    ${plans.map(planCard).join("")}
  </div>

  <div class="card card--paper" style="margin-top:6px;">
    <div class="eyebrow">people you've eaten with</div>
    <div class="row gap-sm">
      ${friends
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

function planCard(p) {
  return /*html*/ `
  <a href="#/plan/${p.id}" class="plancard">
    <div class="plancard__head">
      <div class="col">
        <div class="plancard__title">${p.spot}</div>
        <div class="plancard__meta">${p.time} · ${p.distanceLabel}</div>
      </div>
      <span class="plancard__more">${p.more} more</span>
    </div>
    <div class="chip-row">
      ${p.tags.map((t) => `<span class="chip chip--soft">${t}</span>`).join("")}
    </div>
    <div class="plancard__foot">
      <div class="plancard__host">
        <div class="avatar" style="width:24px;height:24px;font-size:14px;">${p.host.emoji}</div>
        hosted by <strong>${p.host.name}</strong> · ${p.filled}/${p.seats}
      </div>
      <div class="match"><span class="hand">${p.match}%</span> <span class="match__label">match</span></div>
    </div>
  </a>`;
}

/* =====================================================
   START A PLAN  (fill-in-the-blanks conversational)
   ===================================================== */
export function renderStart() {
  return /*html*/ `
  ${statusbar()}
  ${header({
    left: `<a href="#/home" class="iconbtn">✕</a>`,
    center: "new plan",
  })}

  <div class="inlineform">
    I want to grab
    <span class="inlineform__chip">ramen</span>
    at
    <span class="inlineform__chip">Mehak's</span>
    around
    <span class="inlineform__chip">7:00 pm</span>
    with
    <span class="inlineform__chip">3 people</span>
    · budget
    <span class="inlineform__chip">$$</span>.
  </div>

  <div class="eyebrow">vibe (pick 1–3)</div>
  <div class="chip-row">
    ${checkChip("chill", true)}
    ${checkChip("study after", true)}
    ${checkChip("loud", false)}
    ${checkChip("first dates ok", false)}
    ${checkChip("quiet", false)}
    ${checkChip("friend group", true)}
  </div>

  <div class="eyebrow">note to joiners (optional)</div>
  <textarea class="field" rows="3">craving a hot soup after the prelim 😮‍💨</textarea>

  <div class="card card--tint">
    <div class="eyebrow">bot will find</div>
    <div class="hand" style="font-size:24px;">~7 strong matches</div>
    <div class="muted tiny">verified, 90%+ reliability, similar vibe tags</div>
  </div>

  <div class="card" style="padding:12px 14px;">
    <div class="row gap-md">
      <div class="avatar-stack">
        <div class="avatar">🌿</div>
        <div class="avatar">🎧</div>
        <div class="avatar">🍓</div>
        <div class="avatar">🌙</div>
        <div class="avatar">🦊</div>
      </div>
      <div class="col">
        <div class="tiny"><strong>+ 4 more</strong></div>
        <div class="tiny muted">All verified · avg reliability 96% · 3 mutuals</div>
      </div>
    </div>
  </div>

  <div class="row gap-md" style="align-items:flex-start;">
    <span class="muted tiny" style="flex:1;">you'll only show as host. bot handles intros.</span>
    <a class="btn btn--primary" style="width:auto;padding:12px 18px;" href="#/plan/p1">Drop plan ▷</a>
  </div>
  <div class="muted tiny center">auto-cancels if not full by 6:55pm</div>`;
}

/* =====================================================
   JOIN A PLAN  (50/50 split — map + ranked list)
   ===================================================== */
export function renderJoin() {
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
    <div class="hand" style="font-size:22px;">${plans.length} matches near you</div>
    <span class="muted tiny">SORT: ai ▾</span>
  </div>

  <div class="stack gap-md">
    ${plans.slice(0, 3).map(rankedRow).join("")}
  </div>`;
}

function rankedRow(p) {
  return /*html*/ `
  <a href="#/plan/${p.id}" class="card" style="padding:12px 14px;">
    <div class="row gap-md">
      <div class="col" style="align-items:center;width:48px;">
        <span class="hand" style="font-size:24px;color:var(--accent);">${p.match}%</span>
        <span class="muted tiny" style="letter-spacing:1px;">match</span>
      </div>
      <div class="col" style="flex:1;">
        <div class="row row--between">
          <strong>${p.spot}</strong>
          <span class="muted tiny">${p.time}</span>
        </div>
        <div class="muted tiny">↳ matches your vibe + ${p.more} mutuals</div>
        <div class="chip-row" style="margin-top:6px;">
          ${p.tags.map((t) => `<span class="chip chip--soft">${t}</span>`).join("")}
        </div>
      </div>
      <span class="badge">+${p.more}</span>
    </div>
  </a>`;
}

/* =====================================================
   MAP  (avatar clusters)
   ===================================================== */
export function renderMap() {
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
        <span class="hand" style="font-size:22px;color:var(--accent);">${plans.length} plans</span>
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
   PLAN DETAIL
   ===================================================== */
export function renderPlan() {
  const p = featuredPlan;
  return /*html*/ `
  ${statusbar()}
  ${header({
    left: `${back()}`,
    right: `<span class="chip chip--soft">⊕ verified</span>`,
  })}

  <div class="hero">
    <div class="hero__match">${p.match}% MATCH</div>
    <div class="hero__eyebrow">TONIGHT · ${p.in}</div>
    <h2 class="hero__title">${p.spot}</h2>
    <div class="muted">${p.time} · ${featuredPlan.walk} · College Town</div>
    <div class="chip-row" style="margin-top:8px;">
      ${p.tags.map((t) => `<span class="chip chip--soft">${t}</span>`).join("")}
    </div>
  </div>

  <div class="eyebrow">who's coming (${p.group.filled} / ${p.group.seats})</div>
  <div class="card roster">
    ${p.roster
      .map(
        (r) => `
      <div class="roster__row">
        <div class="avatar ${r.open ? "" : ""}" style="${r.open ? "border-style:dashed;" : ""}">${r.emoji}</div>
        <div class="col" style="flex:1;">
          <div class="roster__name">${r.name}${r.role ? ` <span class="muted tiny">(${r.role})</span>` : ""}</div>
          <div class="roster__sub">${r.sub}</div>
        </div>
        ${r.tag ? `<span class="chip chip--soft tiny">${r.tag}</span>` : ""}
      </div>`
      )
      .join("")}
  </div>

  <div class="callout">
    <div class="callout__title">🤖 bot summary</div>
    ${p.summary}
  </div>

  <div class="row gap-md">
    <a href="#/home" class="btn btn--ghost">Pass</a>
    <a href="#/chat" class="btn btn--primary">Join — claim seat →</a>
  </div>
  <div class="muted tiny center">tap join → bot intros you. takes ~20 seconds.</div>`;
}

/* =====================================================
   CHAT  (group bot thread)
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
   PROFILE  (Notion-style callouts)
   ===================================================== */
export function renderProfile() {
  return /*html*/ `
  ${statusbar()}
  ${header({
    left: `${back()}`,
    right: `<a class="muted tiny" href="#/me">edit</a>`,
  })}

  <div class="proheader">
    <div class="avatar avatar--xl tilt-1">${me.emoji}</div>
    <div class="hand" style="font-size:34px;line-height:1;">${me.name}</div>
    <div class="muted">${me.year} · ${me.major} · ${me.pronouns} · ${me.age}</div>
    <div class="row gap-sm" style="margin-top:6px;">
      <span class="chip chip--soft chip--check">.edu verified</span>
      <span class="chip chip--soft chip--check">${me.attended + me.cancelled} dinners</span>
    </div>
  </div>

  <div class="relcallout">
    <div class="relring"><span class="relring__num">${me.reliability}%</span></div>
    <div class="col">
      <div class="eyebrow">reliability</div>
      <div class="muted tiny">${me.attended} attended · ${me.cancelled} cancelled w/ notice · ${me.flakes} flakes</div>
    </div>
  </div>

  <div class="callout">
    💭 ${me.bio}
  </div>

  <div class="eyebrow">food</div>
  <div class="chip-row">
    ${me.food.map((f) => `<span class="chip chip--soft">${f}</span>`).join("")}
  </div>

  <div class="eyebrow">vibe</div>
  <div class="chip-row">
    ${me.vibe.map((v) => `<span class="chip chip--soft">${v}</span>`).join("")}
  </div>

  <div class="row gap-md">
    <div class="col" style="flex:1;">
      <div class="eyebrow">budget</div>
      <span class="chip chip--accent" style="align-self:flex-start;">${me.budget}</span>
    </div>
    <div class="col" style="flex:1;">
      <div class="eyebrow">group size</div>
      <span class="chip chip--soft" style="align-self:flex-start;">${me.groupSize} people</span>
    </div>
  </div>

  <div class="eyebrow">past connections · ${me.connections}</div>
  <div class="row gap-sm">
    ${friends.map((f) => `<div class="avatar">${f.emoji}</div>`).join("")}
    <span class="muted tiny">+ ${me.connections - friends.length}</span>
  </div>`;
}
