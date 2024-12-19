import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getSecretValue } from "../vault";

function loadRegister() {
  const content = document.getElementById("app");
  content.innerHTML = `
    <div class="register-container">
      <div class="register-card">
        <h3 class="register-title">Create an Account</h3>
        <div id="alert-container"></div>
        
        <form id="register-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-input" placeholder="Email" required>
          </div>
          
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input type="text" id="username" class="form-input" placeholder="Username" required>
          </div>
          
          <div class="form-group">
            <label for="first_name" class="form-label">First Name</label>
            <input type="text" id="first_name" class="form-input" placeholder="First Name" required>
          </div>
          
          <div class="form-group">
            <label for="last_name" class="form-label">Last Name</label>
            <input type="text" id="last_name" class="form-input" placeholder="Last Name" required>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="password-input-wrapper">
              <input type="password" id="password" class="form-input" placeholder="Password" required minLength="8">
              <button type="button" id="toggle-password" class="toggle-btn">
                <i id="password-icon" class="bi bi-eye"></i>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password2" class="form-label">Confirm Password</label>
            <input type="password" id="password2" class="form-input" placeholder="Confirm Password" required minLength="8">
          </div>
          
          <button type="submit" class="submit-btn">Register</button>
        </form>
        
        <div class="login-link">
          <a href="/login">Already have an account?</a>
        </div>
      </div>
    </div>
  `;

  // Add styles
  const styles = document.createElement('style');
  styles.textContent = `
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .register-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .register-title {
      color: #ff4d4d;
      text-align: center;
      margin-bottom: 30px;
      font-size: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      color: #666;
    }

    .form-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
    }

    .password-input-wrapper {
      position: relative;
    }

    .toggle-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
    }

    .submit-btn {
      width: 100%;
      padding: 12px;
      background: #ff4d4d;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      margin-bottom: 20px;
    }

    .login-link {
      text-align: center;
    }

    .login-link a {
      color: #666;
      text-decoration: none;
      font-size: 14px;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    .alert-danger {
      background-color: #ffe6e6;
      color: #ff4d4d;
      padding: 12px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
  `;
  document.head.appendChild(styles);

  // 기존 JavaScript 코드 유지
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


// function loadRegister() {
//   const content = document.getElementById("app");
//   content.innerHTML = `
//         <div class="container mt-5">
//         <h3 class="text-center text-muted mb-4">Create an Account</h3>
//         <div id="alert-container"></div>
//         <form id="register-form">
//             <div class="mb-3">
//                 <label for="email" class="form-label">Email</label>
//                 <input type="email" id="email" class="form-control" placeholder="Email" required>
//             </div>
//             <div class="mb-3">
//                 <label for="username" class="form-label">Username</label>
//                 <input type="text" id="username" class="form-control" placeholder="Username" required>
//             </div>
//             <div class="mb-3">
//                 <label for="first_name" class="form-label">First Name</label>
//                 <input type="text" id="first_name" class="form-control" placeholder="First Name" required>
//             </div>
//             <div class="mb-3">
//                 <label for="last_name" class="form-label">Last Name</label>
//                 <input type="text" id="last_name" class="form-control" placeholder="Last Name" required>
//             </div>
//             <div class="mb-3">
//                 <label for="password" class="form-label">Password</label>
//                 <input type="password" id="password" class="form-control" placeholder="Password" required minLength="8">
//                 <button type="button" id="toggle-password" class="btn btn-secondary mt-2">
//                     <i id="password-icon" class="bi bi-eye"></i>
//                 </button>
//             </div>
//             <div class="mb-3">
//                 <label for="password2" class="form-label">Confirm Password</label>
//                 <input type="password" id="password2" class="form-control" placeholder="Confirm Password" required minLength="8">
//             </div>
//             <button type="submit" class="btn btn-primary w-100">Register</button>
//         </form>
//         <div class="text-center mt-3">
//             <a href="/login"><small>Already have an account?</small></a>
//         </div>
//         </div>
//     `;

//   const registerForm = document.getElementById("register-form");
//   const emailInput = document.getElementById("email");
//   const usernameInput = document.getElementById("username");
//   const firstNameInput = document.getElementById("first_name");
//   const lastNameInput = document.getElementById("last_name");
//   const passwordInput = document.getElementById("password");
//   const password2Input = document.getElementById("password2");
//   const alertContainer = document.getElementById("alert-container");
//   const togglePasswordBtn = document.getElementById("toggle-password");
//   const passwordIcon = document.getElementById("password-icon");

//   let showPassword = false;

//   togglePasswordBtn.addEventListener("click", () => {
//     showPassword = !showPassword;
//     passwordInput.type = showPassword ? "text" : "password";
//     passwordIcon.className = showPassword ? "bi bi-eye-slash" : "bi bi-eye";
//   });

//   registerForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const email = emailInput.value;
//     const username = usernameInput.value;
//     const first_name = firstNameInput.value;
//     const last_name = lastNameInput.value;
//     const password = passwordInput.value;
//     const password2 = password2Input.value;

//     if (password !== password2) {
//       showAlert("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         await getSecretValue('front/FRONT_API_ACCOUNTS_REGISTER'),
//         {
//           email,
//           username,
//           first_name,
//           last_name,
//           password,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 201) {
//         window.location.href = "/verify";
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

//   function showAlert(message) {
//     alertContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
//   }
// }

// export { loadRegister };
