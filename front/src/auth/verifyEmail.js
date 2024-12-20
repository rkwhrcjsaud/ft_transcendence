import axios from "axios";

function loadVerifyEmail() {
  const content = document.getElementById("app");
  content.innerHTML = `
    <div class="container mt-5">
      <h3 class="text-center text-muted mb-4">A code has been sent to your email</h3>
      <div id="alert-container"></div>
      <form id="verify-email-form">
        <div class="mb-3">
          <label for="email" class="form-label">Enter your email</label>
          <input type="email" id="email" class="form-control" placeholder="Enter your email" required />
        </div>
        <div class="mb-3">
          <label for="otp" class="form-label">Enter your code</label>
          <input type="text" id="otp" class="form-control" placeholder="Enter your OTP code" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Verify</button>
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
      alertContainer.innerHTML = `<div class="alert alert-danger">Both email and OTP code are required</div>`;
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
          alertMessage = "You are already registered";
          alertColour = "warning";
          break;
        case 404:
          alertMessage = "Please provide your code";
          alertColour = "danger";
          break;
        default:
          alertMessage = "An unexpected error occurred";
          alertColour = "danger";
      }
    } catch (error) {
      alertMessage = "An error occurred. Please check your connection.";
      alertColour = "danger";
    }

    if (alertMessage) {
      alertContainer.innerHTML = `<div class="alert alert-${alertColour}">${alertMessage}</div>`;
    }
  });
}

export { loadVerifyEmail };