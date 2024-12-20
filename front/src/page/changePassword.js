import { loadCSS } from "../utils/loadcss";

export function loadChangePassword() {
  loadCSS("../styles/changePassword.css");

  const html = `<div class="change-pw-container">
      <h1 class="change-pw-title">비밀번호 변경</h1>
      <div class="change-pw-content">
        <div class="form-section">
          <form class="change-pw-form">
            <div class="form-group">
              <label class="form-label">현재 비밀번호</label>
              <div class="password-input-container">
                <input type="password" id="currentPassword" class="form-input">
                <span class="password-toggle" data-for="currentPassword">
                  <i class="fa-regular fa-eye-slash"></i>
                </span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">새 비밀번호</label>
              <div class="password-input-container">
                <input type="password" id="newPassword" class="form-input">
                <span class="password-toggle" data-for="newPassword">
                  <i class="fa-regular fa-eye-slash"></i>
                </span>
              </div>
              <div class="pw-rules-msg">(예시)*영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10~16자</div>
            </div>
            <div class="form-group">
              <label class="form-label">새 비밀번호 확인</label>
              <div class="password-input-container">
                <input type="password" id="newPassword_retype" class="form-input">
                <span class="password-toggle" data-for="newPassword_retype">
                  <i class="fa-regular fa-eye-slash"></i>
                </span>
              </div>
              <div id="newPwIncorrectMsg" class="new-pw-incorrect-msg">
                비밀번호가 일치하지 않습니다. 새 비밀번호를 확인해주세요.
              </div>
            </div>
          </form>
          <div class="form-buttons">
            <button type="button" class="pw-cancel-btn">
                <a href="/dashboard" data-router-link>뒤로가기</a>
            </button>
            <button type="submit" class="pw-save-btn">변경하기</button>
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

  // 비밀번호 확인 로직
  const newPassword = document.getElementById("newPassword");
  const newPasswordRetype = document.getElementById("newPassword_retype");
  const newPwIncorrectMsg = document.getElementById("newPwIncorrectMsg");

  function checkPasswords() {
    if (newPassword.value !== newPasswordRetype.value) {
      newPwIncorrectMsg.style.visibility = "visible";
    } else {
      newPwIncorrectMsg.style.visibility = "hidden";
    }
  }

  newPassword.addEventListener("input", checkPasswords);
  newPasswordRetype.addEventListener("input", checkPasswords);

  // 폼 제출 이벤트
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (newPassword.value === newPasswordRetype.value) {
      alert("비밀번호가 성공적으로 변경되었습니다!");
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  });
}
