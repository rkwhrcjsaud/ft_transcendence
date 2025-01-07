import { loadCSS } from "../utils/loadcss";
import { language } from "../utils/language";
import { getSecretValue } from "../vault";
import { createAxiosInstance } from "../utils/axiosInterceptor";

export async function loadChangePassword() {
  loadCSS("../styles/changePassword.css");
  const languageKey = localStorage.getItem("selectedLanguage");
  const html = `<div class="change-pw-container">
      <h1 class="change-pw-title">${language[languageKey]["ChangePassword"]}</h1>
      <div class="change-pw-content">
        <div class="form-section">
          <form class="change-pw-form">
            <div class="form-group">
              <label class="form-label">${language[languageKey]["CurrentPassword"]}</label>
              <div class="password-input-container">
                <input type="password" id="currentPassword" class="form-input">
                <span class="password-toggle" data-for="currentPassword">
                  <i class="fa-regular fa-eye-slash"></i>
                </span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">${language[languageKey]["NewPassword"]}</label>
              <div class="password-input-container">
                <input type="password" id="newPassword" class="form-input" minlength="8">
                <span class="password-toggle" data-for="newPassword">
                  <i class="fa-regular fa-eye-slash"></i>
                </span>
              </div>
              <div class="pw-rules-msg">${language[languageKey]["PasswordRule"]}</div>
            </div>
            <div class="form-group">
              <label class="form-label">${language[languageKey]["ConfirmPassword"]}</label>
              <div class="password-input-container">
                <input type="password" id="newPassword_retype" class="form-input" minlength="8">
                <span class="password-toggle" data-for="newPassword_retype">
                  <i class="fa-regular fa-eye-slash"></i>
                </span>
              </div>
              <div id="newPwIncorrectMsg" class="new-pw-incorrect-msg">
              ${language[languageKey]["IncorrectPassword"]}
              </div>
            </div>
          </form>
          <div class="change-pw-form-buttons">
            <button type="button" class="pw-cancel-btn">
                <a href="/dashboard" data-router-link>${language[languageKey]["Back"]}</a>
            </button>
            <button type="submit" class="pw-save-btn">${language[languageKey]["Change"]}</button>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById("app").innerHTML = html;

  // 모든 비밀번호 입력 필드에 토글 기능 추가
  const toggles = document.querySelectorAll(".password-toggle");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const targetId = this.getAttribute("data-for");
      const passwordInput = document.getElementById(targetId);
      const icon = this.querySelector("i");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.className = "fa-regular fa-eye";
      } else {
        passwordInput.type = "password";
        icon.className = "fa-regular fa-eye-slash";
      }
    });
  });

  // 새 비밀번호 확인 로직
  const newPassword = document.getElementById("newPassword");
  const newPasswordRetype = document.getElementById("newPassword_retype");
  const newPwIncorrectMsg = document.getElementById("newPwIncorrectMsg");
  const passwordRuleMsg = document.querySelector(".pw-rules-msg");

  function checkNewPassword() {
    const newPasswordValue = newPassword.value.trim();
    const newPasswordRetypeValue = newPasswordRetype.value.trim();

    // 새 비밀번호가 8자 미만인지 체크
    if (newPasswordValue.length < 8) {
      passwordRuleMsg.style.display = "block";
      savePasswordButton.disabled = true;
      savePasswordButton.style.backgroundColor = "#666666";
    } else {
      passwordRuleMsg.style.display = "none";
    }

    // 새 비밀번호 확인 입력값이 비어 있는 경우
    if (!newPasswordRetypeValue) {
      newPwIncorrectMsg.textContent =
        language[languageKey]["PasswordRetypeEmpty"];
      newPwIncorrectMsg.style.visibility = "visible";
      savePasswordButton.disabled = true;
      savePasswordButton.style.backgroundColor = "#666666";
      return;
    }

    // 새 비밀번호 != 새 비밀번호 확인 일때
    if (newPasswordValue !== newPasswordRetypeValue) {
      newPwIncorrectMsg.textContent =
        language[languageKey]["IncorrectPassword"];
      newPwIncorrectMsg.style.visibility = "visible";
      savePasswordButton.disabled = true;
      savePasswordButton.style.backgroundColor = "#666666";
    } else {
      newPwIncorrectMsg.style.visibility = "hidden";
      // 8자 이상이고 새 비밀번호가 서로 일치할 때만 버튼 활성화
      if (newPasswordValue.length >= 8) {
        savePasswordButton.disabled = false;
        savePasswordButton.style.backgroundColor = "#ee532c";
      }
    }
  }

  newPassword.addEventListener("input", checkNewPassword);
  newPasswordRetype.addEventListener("input", checkNewPassword);

  // 폼 제출 버튼 이벤트 관련
  const savePasswordButton = document.querySelector(".pw-save-btn");

  savePasswordButton.addEventListener("click", async () => {
    const currentPassword = document
      .getElementById("currentPassword")
      .value.trim();
    const newPasswordValue = newPassword.value.trim();

    // 입력값 검증
    if (!currentPassword) {
      alert(language[languageKey]["CurrentPasswordEmpty"]); // 언어 파일에 추가 필요
      return;
    }

    if (newPasswordValue.length < 8) {
      alert(language[languageKey]["PasswordRule"]);
      return;
    }

    if (newPasswordValue !== newPasswordRetype.value.trim()) {
      alert(language[languageKey]["PasswordMismatch"]);
      return;
    }

    try {
      const axios = await createAxiosInstance();
      const apiUrl = await getSecretValue("front/FRONT_API_CHANGE_PASSWORD");

      const response = await axios.post(apiUrl, {
        current_password: currentPassword,
        new_password: newPasswordValue,
      });

      // 서버 응답 확인
      if (response.status === 200) {
        alert(language[languageKey]["SuccessPasswordChange"]);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Password change failed:", error);

      const serverErrorMsg =
        error.response?.data?.error || JSON.stringify(error.response?.data);
      let errorMsg = language[languageKey]["FailPasswordChange"];

      switch (error.response?.status) {
        case 401: // 현재 비밀번호 불일치
          errorMsg =
            language[languageKey]["CurrentPasswordMismatch"] || errorMsg; // 언어 파일에 추가 필요
          break;
        case 400: // 비밀번호 규칙 위반
          errorMsg = language[languageKey]["PasswordRule"] || errorMsg;
          break;
        default: // 기타 서버 반환 메시지
          errorMsg = serverErrorMsg || errorMsg;
          break;
      }

      alert(errorMsg);
    }
  });
}
