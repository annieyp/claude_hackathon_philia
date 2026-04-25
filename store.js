// In-browser state store. Hydrates from mock seed, persists to
// localStorage so dropping/joining a plan survives a refresh.

import { seedUsers, seedPlans, seedFriendsOf, seedBotThread } from "./mock.js";
import { reliability } from "./engine.js";

const KEY = "philia.state.v1";

function reviveDate(v) {
  return v ? new Date(v) : null;
}

function hydrate() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return seed();
  try {
    const j = JSON.parse(raw);
    for (const id of Object.keys(j.plans)) {
      j.plans[id].startsAt = reviveDate(j.plans[id].startsAt);
      j.plans[id].createdAt = reviveDate(j.plans[id].createdAt);
    }
    return j;
  } catch {
    return seed();
  }
}

function seed() {
  const users = {};
  for (const u of seedUsers) users[u.id] = u;
  const plans = {};
  for (const p of seedPlans) plans[p.id] = p;
  return {
    meId: "u_maya",
    users,
    plans,
    botThread: seedBotThread.slice(),
  };
}

function persist(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

let state = hydrate();

export function getState() {
  return state;
}

export function reset() {
  state = seed();
  persist(state);
}

export function me() {
  return state.users[state.meId];
}

export function userById(id) {
  return state.users[id];
}

export function allUsers() {
  return state.users;
}

export function listPlans({ openOnly = true } = {}) {
  const arr = Object.values(state.plans);
  return openOnly ? arr.filter((p) => p.status !== "cancelled") : arr;
}

export function planById(id) {
  return state.plans[id];
}

export function friendsOfMe() {
  return seedFriendsOf(state.meId).map((id) => state.users[id]).filter(Boolean);
}

export function dropPlan(plan) {
  const id = "p_" + Math.random().toString(36).slice(2, 7);
  const full = {
    id,
    hostId: state.meId,
    seats: 4,
    filledIds: [state.meId],
    waitlist: [],
    status: "open",
    createdAt: new Date(),
    ...plan,
  };
  state.plans[id] = full;
  persist(state);
  return full;
}

export function claimSeat(planId, userId = state.meId) {
  const p = state.plans[planId];
  if (!p) return null;
  if (p.filledIds.includes(userId)) return p;
  if (p.filledIds.length >= p.seats) {
    p.waitlist.push(userId);
  } else {
    p.filledIds.push(userId);
    if (p.filledIds.length === p.seats) p.status = "locked";
  }
  persist(state);
  return p;
}

export function leavePlan(planId, userId = state.meId) {
  const p = state.plans[planId];
  if (!p) return null;
  p.filledIds = p.filledIds.filter((x) => x !== userId);
  if (p.status === "locked" && p.filledIds.length < p.seats) p.status = "open";
  persist(state);
  return p;
}

export function recordOutcome(userId, kind /* attended | cancelled | flake */) {
  const u = state.users[userId];
  if (!u) return;
  u.history = u.history || { attended: 0, cancelled: 0, flakes: 0 };
  if (kind === "attended") u.history.attended++;
  if (kind === "cancelled") u.history.cancelled++;
  if (kind === "flake") u.history.flakes++;
  u.reliabilityCache = reliability(u.history);
  persist(state);
}

export function pushBotMessage(msg) {
  state.botThread.push(msg);
  persist(state);
}
