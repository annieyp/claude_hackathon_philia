import {
  renderOnboarding,
  renderOnboardSwarm,
  renderOnboardVibe,
  renderHome,
  renderStart,
  renderJoin,
  renderMap,
  renderPlan,
  renderAlgo,
  renderChat,
  renderProfile,
} from "./screens.js";
import { dropPlan, claimSeat, leavePlan } from "./store.js";

const screen = document.getElementById("screen");
const tabbar = document.getElementById("tabbar");

const routes = {
  "/": { render: renderOnboarding, tab: null },
  "/onboard": { render: renderOnboarding, tab: null },
  "/onboard/swarm": { render: renderOnboardSwarm, tab: null },
  "/onboard/vibe": { render: renderOnboardVibe, tab: null },
  "/home": { render: renderHome, tab: "home" },
  "/start": { render: renderStart, tab: "start" },
  "/join": { render: renderJoin, tab: "home" },
  "/map": { render: renderMap, tab: "map" },
  "/plan/:id": { render: renderPlan, tab: "home" },
  "/algo": { render: renderAlgo, tab: "home" },
  "/algo/:id": { render: renderAlgo, tab: "home" },
  "/chat": { render: renderChat, tab: "chat" },
  "/me": { render: renderProfile, tab: "me" },
};

function matchRoute(path) {
  if (routes[path]) return routes[path];
  for (const pattern of Object.keys(routes)) {
    if (!pattern.includes(":")) continue;
    const re = new RegExp("^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$");
    if (re.test(path)) return routes[pattern];
  }
  return routes["/"];
}

function navigate() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const route = matchRoute(hash);
  screen.innerHTML = route.render();
  screen.scrollTop = 0;

  if (route.tab) {
    tabbar.hidden = false;
    [...tabbar.querySelectorAll(".tab")].forEach((el) => {
      el.classList.toggle("is-active", el.dataset.tab === route.tab);
    });
  } else {
    tabbar.hidden = true;
  }

  bindToggleChips();
  bindActions();
}

function bindToggleChips() {
  const togglables = screen.querySelectorAll(
    ".inlineform__chip, .chip-row .chip:not(a)"
  );
  togglables.forEach((el) => {
    el.addEventListener("click", () => {
      const isAccent = el.classList.contains("chip--accent");
      const inForm = el.closest(".inlineform");
      if (inForm) {
        el.classList.toggle("inlineform__chip--ghost");
        return;
      }
      el.classList.toggle("chip--accent");
      el.classList.toggle("chip--check");
      el.classList.toggle("chip--soft", isAccent);
    });
  });
}

function bindActions() {
  screen.querySelectorAll("[data-action]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const action = el.dataset.action;
      if (action === "drop") {
        const tags = [...screen.querySelectorAll("#vibe-picker .chip--accent")].map(
          (c) => c.textContent.trim()
        );
        const note = screen.querySelector("#plan-note")?.value || "";
        const startsAt = (() => {
          const d = new Date();
          d.setHours(19, 0, 0, 0);
          return d;
        })();
        const p = dropPlan({
          spot: "Mehak Indian Cuisine",
          cuisine: "ramen",
          emoji: "🍜",
          location: "Collegetown",
          loc: [42.4426, -76.4855],
          startsAt,
          vibeTags: tags.length ? tags : ["chill", "post-class"],
          budgetTier: 2,
          budgetPerPerson: 18,
          note,
        });
        location.hash = `#/plan/${p.id}`;
      } else if (action === "claim") {
        claimSeat(el.dataset.plan);
        navigate();
      } else if (action === "leave") {
        leavePlan(el.dataset.plan);
        navigate();
      }
    });
  });
}

window.addEventListener("hashchange", navigate);
window.addEventListener("load", () => {
  if (!location.hash) location.hash = "#/";
  navigate();
});
