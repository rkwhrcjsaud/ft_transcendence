import { loadLanding } from "./page/landing";
import { loadLogin } from "./page/login";
import { loadRegister } from "./page/register";
import { loadVerifyEmail } from "./auth/verifyEmail";
import { loadGame } from "./page/game";
import { socialLogin } from "./auth/socialLogin";
import { loadDashboard } from "./page/dashboard_related/dashboard";
import { loadEditProfile } from "./page/editProfile";
import { loadChangePassword } from "./page/changePassword";
import Auth from "./auth/authProvider";

const routes = {
  '/': () => protectRoute(loadLanding),
  "/dashboard": () => protectRoute(loadDashboard),
  "/edit_profile": () => protectRoute(loadEditProfile),
  "/change_password": () => protectRoute(loadChangePassword),
  "/play": () => protectRoute(loadGame),

  "/login": () => loadLogin(),
  "/register": () => loadRegister(),
  "/42": () => socialLogin(),
  "/verify": () => loadVerifyEmail(),
};

async function protectRoute(callback) {
  if (await Auth.checkAuth()) {
    callback();
  } else {
    window.location.href = "/login";
  }
};

function clearAppContent() {
  const app = document.getElementById("app");
  if (app) {
      app.innerHTML = ""; // 기존 내용을 초기화
  }
}

function loadPage(path) {
  clearAppContent();
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