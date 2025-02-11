import axios from "axios";
import { loadCSS } from "../utils/loadcss";
import { language } from "../utils/language";
import { getSecretValue } from "../vault";

function loadVerifyEmail() {
  loadCSS("../styles/verifyEmail.css");
  const languageKey = localStorage.getItem("selectedLanguage");

  const html = `
    <div class="verify-email-container mt-5">
      <h1 class="verify-email-title">${language[languageKey]["VerifyEmail"]}</h1>
      <div id="alert-container"></div>
      <form id="verify-email-form">
        <div class="verify-from-group form-group mb-3">
          <label for="verify-email" class="verify-form-label">${language[languageKey]["Email"]}</label>
          <div class="email-form-input-container">
            <input type="email" id="verify-email" class="verify-form-input" placeholder="${language[languageKey]["InputEmail"]}">
          </div>
        </div>

        <div class="form-group mb-3">
          <label for="otp" class="verify-form-label">${language[languageKey]["VerifyCode"]}</label>
          <div class="otp-form-input-container">
            <input type="text" id="otp" class="verify-form-input" placeholder="${language[languageKey]["InputVerifyCode"]}">
          </div>
        </div>
        <button type="submit" class="verify-email-submit-btn btn btn-primary w-100">${language[languageKey]["Verify"]}</button>
      </form>
    </div>
  `;

  document.getElementById("app").innerHTML += html;

  const verifyEmailForm = document.getElementById("verify-email-form");
  const emailInput = document.getElementById("verify-email");
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
        await getSecretValue("front/FRONT_API_ACCOUNTS_VERIFY"),
        { email: email, code: otp },
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
      alertColour = "danger";
      alertMessage = language[languageKey]["Error"];
    }

    if (alertMessage) {
      alertContainer.innerHTML = `<div class="alert alert-${alertColour}">${alertMessage}</div>`;
    }
  });
}

export { loadVerifyEmail };
