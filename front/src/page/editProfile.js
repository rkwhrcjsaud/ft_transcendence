import { loadCSS } from "../utils/loadcss";
import { language } from "../utils/language";
import { createAxiosInstance } from "../utils/axiosInterceptor";

export async function loadEditProfile() {
  loadCSS("../styles/editProfile.css");
  const languageKey = localStorage.getItem("selectedLanguage");
  const html = `
    <div class="edit-profile-container">
        <h1 class="edit-profile-title">${language[languageKey]["EditAccount"]}</h1>
        <div class="edit-profile-content">
            <div class="profile-section">
                <div class="profile-image-wrapper">
                    <img id="profileImage" src="default_profile.jpeg" alt="Profile" class="edit-profile-image">
                    <button id="deleteImageBtn" class="delete-image-btn">
                        <i class="fa-solid fa-circle-xmark"></i>
                    </button>
                </div>
                <label for="imageUpload" class="upload-btn">
                    <i class="fa-solid fa-arrow-up-from-bracket"></i>${language[languageKey]["ImageUpload"]}
                </label>
                <input id="imageUpload" type="file" accept="image/*" style="display: none;">
            </div>
            <div class="form-section">
                <form class="edit-profile-form">
                    <div class="form-group">
                        <label class="form-label">${language[languageKey]["Email"]}</label>
                        <p id="edit-profile-email" class="fixed-text"></p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">${language[languageKey]["Nickname"]}</label>
                        <input type="text" id="nickname" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">${language[languageKey]["LastName"]}</label>
                        <p type="text" id="lastName" class="fixed-text">
                    </div>
                    <div class="form-group">
                        <label class="form-label">${language[languageKey]["FirstName"]}</label>
                        <p type="text" id="firstName" class="fixed-text">
                    </div>
                </form>
                <div class="form-buttons">
                    <button type="button" id="deleteAccountBtn" class="edit-profile-cancel-btn">${language[languageKey]["DeleteAccount"]}</button>
                    <button type="submit" id="saveProfileBtn" class="edit-profile-save-btn">${language[languageKey]["Save"]}</button>
                </div>
            </div>
        </div>
    </div>`;

  document.getElementById("app").innerHTML = html;

  const profileImage = document.getElementById("profileImage");
  const deleteImageBtn = document.getElementById("deleteImageBtn");
  const imageUpload = document.getElementById("imageUpload");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const deleteAccountBtn = document.getElementById("deleteAccountBtn");

  // Axios 인스턴스 생성
  const axios = await createAxiosInstance();

  // 유저 정보 데이터 로드 (이메일, 성, 이름, 닉네임, 프로필 이미지)
  async function loadProfileData() {
    try {
      const response = await axios.get("/accounts/profile/");
      const data = response.data;

      // Mock 데이터 기반 유저 정보 업데이트
      document.getElementById("nickname").value = data.nickname || "";
      document.getElementById("lastName").textContent = data.last_name || "";
      document.getElementById("firstName").textContent = data.first_name || "";
      document.getElementById("edit-profile-email").textContent = data.email || "";
      console.log("data.profile_image", data.profile_image);
      if (data.profile_image & (data.profile_image !== "")) {
        profileImage.src = data.profile_image;
      } else {
        profileImage.src = "default_profile.jpeg";
      }
    } catch (error) {
      console.error("Failed to load profile data:", error);
      alert(language[languageKey]["ErrorLoadingProfile"]);
    }
  }

  loadProfileData();

  // 프로필 저장 버튼 클릭 시
  saveProfileBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("nickname", document.getElementById("nickname").value);
    formData.append("last_name", document.getElementById("lastName").value);
    formData.append("first_name", document.getElementById("firstName").value);
    if (imageUpload.files[0]) {
      formData.append("profile_image", imageUpload.files[0]);
    }

    try {
      await axios.put("/accounts/profile/", formData);
      alert(language[languageKey]["ProfileUpdated"]);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(language[languageKey]["ErrorUpdatingProfile"]);
    }
  });

  // 계정 삭제 버튼 클릭 시
  deleteAccountBtn.addEventListener("click", async () => {
    if (confirm(language[languageKey]["DeleteAccountConfirm"])) {
      try {
      } catch (error) {
        console.error("Failed to delete account:", error);
      }
    }
  });

  // 이미지 업로드
  imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profileImage.src = e.target.result;
        deleteImageBtn.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // 이미지 초기화
  deleteImageBtn.addEventListener("click", () => {
    profileImage.src = "default_profile.jpeg";
    imageUpload.value = null;
  });
}
