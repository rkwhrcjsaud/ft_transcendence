import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getSecretValue } from "../vault";
import { loadCSS } from "../utils/loadcss";

export function loadRegister() {
  loadCSS("../styles/register.css");

  const html = `
    <div class="register-container">
      <div class="register-card">
        <h3 class="register-title">회원가입</h3>
        <div id="alert-container"></div>
        
        <form id="register-form">
          <div class="form-group">
            <label for="email" class="form-label">이메일</label>
            <input type="email" id="email" class="form-input" placeholder="Email" required>
          </div>
          
          <div class="form-group">
            <label for="username" class="form-label">닉네임</label>
            <input type="text" id="username" class="form-input" placeholder="Username" required>
          </div>
          
          <div class="form-group">
            <label for="first_name" class="form-label">성</label>
            <input type="text" id="first_name" class="form-input" placeholder="First Name" required>
          </div>
          
          <div class="form-group">
            <label for="last_name" class="form-label">이름</label>
            <input type="text" id="last_name" class="form-input" placeholder="Last Name" required>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">비밀번호</label>
            <div class="password-input-wrapper">
              <input type="password" id="password" class="form-input" placeholder="Password" required minLength="8">
              <button type="button" id="toggle-password" class="toggle-btn">
                <i id="password-icon" class="bi bi-eye"></i>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password2" class="form-label">비밀번호 확인</label>
            <div class="confirm-password-input-wrapper">
              <input type="password" id="password2" class="form-input" placeholder="Confirm Password" required minLength="8">
              <button type="button" id="toggle-password2" class="toggle-btn">
                <i id="password-icon2" class="bi bi-eye"></i>
              </button>
            </div>
            <div id="register_newPwIncorrectMsg" class="new-pw-incorrect-msg">
                비밀번호가 일치하지 않습니다. 비밀번호를 확인해주세요.
              </div>
          </div>
          
          <button type="submit" class="submit-btn">가입 완료하기</button>
        </form>
        
        <div class="login-link">
          <span>이미 회원이신가요?</span>
          <a href="/login">로그인 하러가기 🏓</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById("app").innerHTML += html;

  const registerForm = document.getElementById("register-form");
  const emailInput = document.getElementById("email");
  const usernameInput = document.getElementById("username");
  const firstNameInput = document.getElementById("first_name");
  const lastNameInput = document.getElementById("last_name");
  const passwordInput = document.getElementById("password");
  const password2Input = document.getElementById("password2");
  const alertContainer = document.getElementById("alert-container");
  const togglePasswordBtn = document.getElementById("toggle-password");
  const passwordIcon = document.getElementById("password-icon");
  const togglePassword2Btn = document.getElementById("toggle-password2");
  const passwordIcon2 = document.getElementById("password-icon2");

  let showPassword = false;
  let showPassword2 = false;

  // 첫 번째 비밀번호 토글
  togglePasswordBtn.addEventListener("click", () => {
    showPassword = !showPassword;
    passwordInput.type = showPassword ? "text" : "password";
    passwordIcon.className = showPassword ? "bi bi-eye-slash" : "bi bi-eye";
  });

  // 비밀번호 확인 토글
  togglePassword2Btn.addEventListener("click", () => {
    showPassword2 = !showPassword2;
    password2Input.type = showPassword2 ? "text" : "password";
    passwordIcon2.className = showPassword2 ? "bi bi-eye-slash" : "bi bi-eye";
  });

  // 비밀번호 확인 로직
  const Password = document.getElementById("password");
  const PasswordRetype = document.getElementById("password2");
  const register_newPwIncorrectMsg = document.getElementById(
    "register_newPwIncorrectMsg"
  );

  function checkPasswords() {
    if (Password.value !== PasswordRetype.value) {
      register_newPwIncorrectMsg.style.visibility = "visible";
    } else {
      register_newPwIncorrectMsg.style.visibility = "hidden";
    }
  }

  Password.addEventListener("input", checkPasswords);
  PasswordRetype.addEventListener("input", checkPasswords);

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const username = usernameInput.value;
    const first_name = firstNameInput.value;
    const last_name = lastNameInput.value;
    const password = passwordInput.value;
    const password2 = password2Input.value;

    if (password !== password2) {
      showAlert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        await getSecretValue("front/FRONT_API_ACCOUNTS_REGISTER"),
        {
          email,
          username,
          first_name,
          last_name,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        window.location.href = "/verify";
      }
    } catch (error) {
      if (error.response) {
        showAlert(
          error.response.data.error || "An error occurred. Please try again"
        );
      } else {
        showAlert("An unknown error occurred");
      }
    }
  });

  function showAlert(message) {
    alertContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
  }
}
