import axios from "axios";
import { loadCSS } from "../utils/loadcss";
import { language } from "../utils/language";
function loadVerifyEmail() {
  loadCSS("../styles/verifyEmail.css");
  const languageKey = localStorage.getItem("selectedLanguage");
  const content = document.getElementById("app");

  content.innerHTML = `
    <div class="verify-email-container mt-5">
      <h1 class="verify-email-title">${language[languageKey]["VerifyEmail"]}</h1>
      <div id="alert-container"></div>
      <form id="verify-email-form">
        <div class="form-group mb-3">
          <label for="email" class="form-label">${language[languageKey]["Email"]}</label>
          <div class="email-form-wrapper">
            <div class="email-form-input-container">
              <input type="email" id="email" class="form-input" placeholder=${language[languageKey]["InputEmail"]} required>
            </div>
            <button class="send-email-btn">${language[languageKey]["SendEmail"]}</button>
          </div>
        </div>

        <div class="form-group mb-3">
          <label for="otp" class="form-label">${language[languageKey]["VerifyCode"]}</label>
          <div class="otp-form-input-container">
            <input type="text" id="otp" class="form-input" placeholder="${language[languageKey]["InputVerifyCode"]}" required />
          </div>
        </div>
        <button type="submit" class="verify-email-submit-btn btn btn-primary w-100">${language[languageKey]["Verify"]}</button>
      </form>
    </div>
  `;

  const verifyEmailForm = document.getElementById("verify-email-form");
  const emailInput = document.getElementById("email");
  const otpInput = document.getElementById("otp");
  const alertContainer = document.getElementById("alert-container");

  let otp = "";
  let email = "";
  let alertMessage = "";
  let alertColour = "primary";

  otpInput.addEventListener("input", (e) => {
    otp = e.target.value;
  });

  emailInput.addEventListener("input", (e) => {
    email = e.target.value;
  });

  verifyEmailForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      alertContainer.innerHTML = `<div class="alert alert-danger">${language[languageKey]["Requirement"]}</div>`;
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_CN_URL}/api/accounts/verify/`,
        { otp: otp, email: email },
        { headers: { "Content-Type": "application/json" } }
      );

      switch (response.status) {
        case 200:
          window.location.href = "/"; // 성공 시 홈으로 이동
          break;
        case 204:
          alertMessage = language[languageKey]["DuplicateEmail"];
          alertColour = "warning";
          break;
        case 404:
          alertMessage = language[languageKey]["PleaseCode"];
          alertColour = "danger";
          break;
        default:
          alertMessage = language[languageKey]["Error"];
          alertColour = "danger";
      }
    } catch (error) {
      alertMessage = language[languageKey]["Error"];
      alertColour = "danger";
    }

    if (alertMessage) {
      alertContainer.innerHTML = `<div class="alert alert-${alertColour}">${alertMessage}</div>`;
    }
  });
}

export { loadVerifyEmail };
