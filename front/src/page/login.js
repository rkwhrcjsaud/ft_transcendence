import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getSecretValue } from "../vault";
import { loadCSS } from "../utils/loadcss";
import { language } from "../utils/language";
import Auth from "../auth/authProvider";

//기존 js 코드 온전히 유지한채로 구조와 스타일만 변경함
export function loadLogin() {
  loadCSS("../styles/login.css");
  const languageKey = localStorage.getItem("selectedLanguage");
  const html = `
    <div class="login-container">
      <div class="login-card">
        <h3 class="login-title">${language[languageKey]["Login"]}</h3>
        <div id="alert-container"></div>
        
        <form id="login-form">
          <div class="form-group">
            <label for="login-email" class="form-label">${language[languageKey]["Email"]}</label>
            <input type="email" id="login-email" class="form-input" placeholder="Email">
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">${language[languageKey]["Password"]}</label>
            <div class="password-input-wrapper">
              <input type="password" id="password" class="form-input" placeholder="Password">
              <button type="button" id="toggle-password" class="toggle-btn">
                <i id="password-icon" class="bi bi-eye"></i>
              </button>
            </div>
          </div>
          
          <button type="submit" class="submit-btn">${language[languageKey]["Login"]}</button>
        </form>
        
        <div class="social-login">
          <button id="social-login" class="social-btn">
            <a href="/42" data-router-link>
              <img src="/42_logo_white.png" alt="42" class="login-btn-42logo">${language[languageKey]["SocialLogin"]}
            </a>
          </button>
        </div>
        
        <div class="register-link">
          <span>${language[languageKey]["RegisterMessage"]}</span>
          <a href="/register">${language[languageKey]["RegisterPage"]}</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById("app").innerHTML += html;

  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("password");
  const alertContainer = document.getElementById("alert-container");
  const togglePasswordBtn = document.getElementById("toggle-password");
  const passwordIcon = document.getElementById("password-icon");
  const socialLoginBtn = document.getElementById("social-login");

  let showPassword = false;

  togglePasswordBtn.addEventListener("click", () => {
    showPassword = !showPassword;
    passwordInput.type = showPassword ? "text" : "password";
    passwordIcon.className = showPassword ? "bi bi-eye-slash" : "bi bi-eye";
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const response = await axios.post(
        await getSecretValue("front/FRONT_API_ACCOUNTS_LOGIN"),
        { email, password, showPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        const auser = {
          id: response.data.id,
          user: response.data.email,
          full_name: response.data.full_name,
          email: response.data.email,
        };
        const access_token = response.data.access_token;
        const refresh_token = response.data.refresh_token;
        Auth.login(auser, access_token, refresh_token);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        showAlert(
          error.response.data.error || "An error occurred. Please try again"
        );
      } else {
        showAlert("An unknown error occurred");
      }
    }
  });

  socialLoginBtn.addEventListener("click", async () => {
    const authUrl = await getSecretValue("front/FRONT_API_AUTHURL");
    window.location.href = authUrl;
  });

  function showAlert(message) {
    alertContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
  }
}

/* 기존 코드 */
// import axios from "axios";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import { getSecretValue } from "../vault";

// function loadLogin() {
//   const content = document.getElementById("app");
//   content.innerHTML = `
//         <div class="container mt-5">
//         <h3 class="text-center text-muted mb-4">Sign In</h3>
//         <div id="alert-container"></div>
//         <form id="login-form">
//             <div class="mb-3">
//             <label for="email" class="form-label">Email</label>
//             <input type="email"  class="form-control" placeholder="Email">
//             </div>
//             <div class="mb-3">
//             <label for="password" class="form-label">Password</label>
//             <input type="password" id="password" class="form-control" placeholder="Password">
//             <button type="button" id="toggle-password" class="btn btn-secondary mt-2">
//                 <i id="password-icon" class="bi bi-eye"></i>
//             </button>
//             </div>
//             <button type="submit" class="btn btn-primary w-100">Sign In</button>
//         </form>
//         <div class="mt-3">
//             <button id="social-login" class="btn btn-outline-secondary w-100">Sign in with 42</button>
//         </div>
//         <div class="text-center mt-3">
//             <a href="/register"><small>Create an Account</small></a>
//         </div>
//         </div>
//     `;

//   const loginForm = document.getElementById("login-form");
//   const emailInput = document.getElementById("email");
//   const passwordInput = document.getElementById("password");
//   const alertContainer = document.getElementById("alert-container");
//   const togglePasswordBtn = document.getElementById("toggle-password");
//   const passwordIcon = document.getElementById("password-icon");
//   const socialLoginBtn = document.getElementById("social-login");

//   let showPassword = false;

//   togglePasswordBtn.addEventListener("click", () => {
//     showPassword = !showPassword;
//     passwordInput.type = showPassword ? "text" : "password";
//     passwordIcon.className = showPassword ? "bi bi-eye-slash" : "bi bi-eye";
//   });

//   loginForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const email = emailInput.value;
//     const password = passwordInput.value;

//     try {
//       const response = await axios.post(
//         await getSecretValue('front/FRONT_API_ACCOUNTS_LOGIN'),
//         { email, password },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 200) {
//         const auser = {
//           id: response.data.id,
//           username: response.data.email,
//           full_name: response.data.full_name,
//           email: response.data.email,
//         };
//         const { aceess_token, refresh_token } = response.data;
//         Auth.login(auser, aceess_token, refresh_token);
//         window.location.href = "/";
//       }
//     } catch (error) {
//       if (error.response) {
//         showAlert(
//           error.response.data.error || "An error occurred. Please try again"
//         );
//       } else {
//         showAlert("An unknown error occurred");
//       }
//     }
//   });

//   socialLoginBtn.addEventListener("click", async () => {
//     const authUrl =
//       await getSecretValue('front/FRONT_API_AUTHURL')
//     window.location.href = authUrl;
//   });

//   function showAlert(message) {
//     alertContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
//   }
// }

// export { loadLogin };
