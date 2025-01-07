import { language } from "../../utils/language";
import { loadCSS } from "../../utils/loadcss";
import { getSecretValue } from "../../vault";
import { createAxiosInstance } from "../../utils/axiosInterceptor";

export async function ProfileAccordion() {
  const loadContent = async () => {
    loadCSS("../../styles/profileAccordion.css");
    const languageKey = localStorage.getItem("selectedLanguage");
    const html = `
      <div class="accordion" id="profileAccordion">
        <div class="accordion-item">
          <h2 class="accordion-header" id="profileHeader">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#profileContent"
              aria-expanded="true"
              aria-controls="profileContent"
            >
              ${language[languageKey]["Profile"]}
              <i class="fa-solid fa-chevron-down ms-2"></i>
            </button>
          </h2>
          <div
            id="profileContent"
            class="accordion-collapse collapse show"
            aria-labelledby="profileHeader"
            data-bs-parent="#profileAccordion"
          >
            <div class="accordion-body">
              <div class="profile-container">
                <div class="profile-image">
                  <img src="/default_profile.jpeg" alt="Profile" />
                </div>
                <h2 class="profile-name">ranchoi</h2>
                <div class="profile-buttons">
                  <button class="profile-button profile-setting-btn">
                    <i class="fas fa-cog"></i>
                    <a href="/edit_profile" data-router-link>
                      ${language[languageKey]["ProfileEdit"]}
                    </a>
                  </button>
                  <button class="profile-button profile-password-change-btn">
                    <i class="fas fa-lock"></i>
                    ${language[languageKey]["PasswordChange"]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("app").innerHTML += html;
    let authProvider = null;

    // Document-level click listener 추가 (버튼에 직접 할당 시 작동 x)
    document.addEventListener("click", (e) => {
      // 비밀번호 변경 버튼 클릭 시 authProvider 종류에 따라 동작
      if (e.target.closest(".profile-password-change-btn")) {
        e.preventDefault();
        console.log("Password change button clicked.");
        if (authProvider === "email") {
          window.location.href = "/change_password";
        } else if (authProvider === "42") {
          alert("42 소셜 로그인 계정입니다. 비밀번호 직접 변경이 불가합니다.");
        }
      }
    });

    try {
      const axios = await createAxiosInstance();
      const apiUrl = await getSecretValue("front/FRONT_API_MYUSER");
      const response = await axios.get(apiUrl);
      authProvider = response.data.auth_provider;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // DOM 준비 후 콘텐츠 로드하기
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent);
  } else {
    await loadContent();
  }
}

