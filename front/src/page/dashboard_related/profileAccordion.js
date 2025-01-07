import { language } from "../../utils/language";
import { loadCSS } from "../../utils/loadcss";
import { getSecretValue } from "../../vault";
import { createAxiosInstance } from "../../utils/axiosInterceptor";

export async function ProfileAccordion() {
  const loadContent = async () => {
    loadCSS("../../styles/profileAccordion.css");
    const languageKey = localStorage.getItem("selectedLanguage");

    // 사용자 정보 먼저 가져오기
    let userProfile = {
      nickname: "User",
      profile_image: "/default_profile.jpeg"
    };
    
    try {
      const axios = await createAxiosInstance();
      const response = await axios.get("/accounts/profile/");
      
      // 이미지 URL 처리
      let profileImageUrl = "/default_profile.jpeg";
      if (response.data.profile_image) {
        // URL을 상대 경로로 변환
        const imageUrl = response.data.profile_image;
        if (imageUrl.startsWith('http://')) {
          // http://localhost 부분을 제거하고 상대 경로만 사용
          profileImageUrl = new URL(imageUrl).pathname;
        } else if (imageUrl.startsWith('https://')) {
          profileImageUrl = new URL(imageUrl).pathname;
        } else {
          profileImageUrl = imageUrl;
        }
      }

      userProfile = {
        nickname: response.data.nickname || "User",
        profile_image: profileImageUrl
      };
    } catch (error) {
      console.error("Failed to load profile data:", error);
    }

    // HTML 렌더링
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
                  <img 
                    src="${userProfile.profile_image}" 
                    alt="Profile" 
                    onerror="this.src='/default_profile.jpeg'" 
                  />
                </div>
                <h2 class="profile-name">${userProfile.nickname}</h2>
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

    // auth_provider 정보 가져오기
    let authProvider = null;
    try {
      const axios = await createAxiosInstance();
      const apiUrl = await getSecretValue("front/FRONT_API_MYUSER");
      const response = await axios.get(apiUrl);
      authProvider = response.data.auth_provider;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }

    // 비밀번호 변경 버튼 이벤트 리스너
    document.addEventListener("click", (e) => {
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
  };

  // DOM이 준비되면 콘텐츠 로드
  await loadContent();
}