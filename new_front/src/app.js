import { loadLogin } from "./page/login";
import { loadRegister } from "./page/register";
import { loadVerifyEmail } from "./auth/verifyEmail";
import { loadMultyGame } from "./page/multyGame";
import { socialLogin } from "./auth/socialLogin";
import { loadDashboard } from "./page/dashboard_related/dashboard";

const routes = {
  // '/': () => loadLanding(),
  "/dashboard": () => loadDashboard(),
  "/multygame": () => loadMultyGame(),
  // '/profile': () => loadProfile(),

  "/login": () => loadLogin(),
  "/register": () => loadRegister(),
  "/42": () => socialLogin(),
  "/verify": () => loadVerifyEmail(),
};

function loadPage(path) {
  const route = routes[path];
  if (route) {
    route();
  } else {
    loadErrorPage();
  }
}

function setupRouter() {
  window.addEventListener("popstate", () => {
    loadPage(window.location.pathname);
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && e.target.dataset.routerLink !== undefined) {
      e.preventDefault();
      const path = e.target.getAttribute("href");
      window.history.pushState({}, "", path);
      loadPage(path);
    }
  });
}

function loadErrorPage() {
  const content = document.getElementById("app");
  content.innerHTML = "<h1>404</hjson>";
}

setupRouter();
loadPage(window.location.pathname);
