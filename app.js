import {
  renderOnboarding,
  renderOnboardSwarm,
  renderOnboardVibe,
  renderHome,
  renderStart,
  renderJoin,
  renderMap,
  renderPlan,
  renderChat,
  renderProfile,
} from "./screens.js";

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
  "/chat": { render: renderChat, tab: "chat" },
  "/me": { render: renderProfile, tab: "me" },
};

function matchRoute(path) {
  if (routes[path]) return routes[path];
  for (const pattern of Object.keys(routes)) {
    if (!pattern.includes(":")) continue;
    const re = new RegExp(
      "^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$"
    );
    if (re.test(path)) return routes[pattern];
  }
  return routes["/"];
}

function navigate() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const route = matchRoute(hash);
  screen.innerHTML = route.render();
  screen.scrollTop = 0;

  // tabbar visibility + active state
  if (route.tab) {
    tabbar.hidden = false;
    [...tabbar.querySelectorAll(".tab")].forEach((el) => {
      el.classList.toggle(
        "is-active",
        el.dataset.tab === route.tab
      );
    });
  } else {
    tabbar.hidden = true;
  }

  // wire up local interactions on every render
  bindToggleChips();
}

function bindToggleChips() {
  // Allow chips on the vibe picker / start screen to toggle without
  // re-routing — keeps the demo feeling responsive.
  const togglables = screen.querySelectorAll(
    ".inlineform__chip, .chip-row .chip:not(a)"
  );
  togglables.forEach((el) => {
    el.addEventListener("click", (e) => {
      const isAccent = el.classList.contains("chip--accent");
      const inForm = el.closest(".inlineform");
      if (inForm) {
        // rotate visual accent only
        el.classList.toggle("inlineform__chip--ghost");
        return;
      }
      // toggle chip styling
      el.classList.toggle("chip--accent");
      el.classList.toggle("chip--check");
      el.classList.toggle("chip--soft", isAccent);
    });
  });
}

window.addEventListener("hashchange", navigate);
window.addEventListener("load", () => {
  if (!location.hash) location.hash = "#/";
  navigate();
});
