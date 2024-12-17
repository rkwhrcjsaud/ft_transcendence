import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getSecretValue } from "../vault";

function loadRegister() {
  const content = document.getElementById("app");
  content.innerHTML = `
        <div class="container mt-5">
        <h3 class="text-center text-muted mb-4">Create an Account</h3>
        <div id="alert-container"></div>
        <form id="register-form">
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" class="form-control" placeholder="Email" required>
            </div>
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" id="username" class="form-control" placeholder="Username" required>
            </div>
            <div class="mb-3">
                <label for="first_name" class="form-label">First Name</label>
                <input type="text" id="first_name" class="form-control" placeholder="First Name" required>
            </div>
            <div class="mb-3">
                <label for="last_name" class="form-label">Last Name</label>
                <input type="text" id="last_name" class="form-control" placeholder="Last Name" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" class="form-control" placeholder="Password" required minLength="8">
                <button type="button" id="toggle-password" class="btn btn-secondary mt-2">
                    <i id="password-icon" class="bi bi-eye"></i>
                </button>
            </div>
            <div class="mb-3">
                <label for="password2" class="form-label">Confirm Password</label>
                <input type="password" id="password2" class="form-control" placeholder="Confirm Password" required minLength="8">
            </div>
            <button type="submit" class="btn btn-primary w-100">Register</button>
        </form>
        <div class="text-center mt-3">
            <a href="/login"><small>Already have an account?</small></a>
        </div>
        </div>
    `;

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

  let showPassword = false;

  togglePasswordBtn.addEventListener("click", () => {
    showPassword = !showPassword;
    passwordInput.type = showPassword ? "text" : "password";
    passwordIcon.className = showPassword ? "bi bi-eye-slash" : "bi bi-eye";
  });

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
        await getSecretValue('front/FRONT_API_ACCOUNTS_REGISTER'),
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

export { loadRegister };
