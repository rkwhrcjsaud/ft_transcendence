import { language } from "../../utils/language";
import { loadCSS } from "../../utils/loadcss";

export function ProfileAccordion() {
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
                <button class="profile-button change-password-btn">
                  <i class="fas fa-lock"></i>
                  <a href="/change_password" data-router-link>
                    ${language[languageKey]["PasswordChange"]}
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("app").innerHTML += html;
}