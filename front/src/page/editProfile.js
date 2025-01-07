import { loadCSS } from "../utils/loadcss";
import { language } from "../utils/language";
import { getSecretValue } from "../vault";
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
                        <p type="text" id="lastName" class="fixed-text"></p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">${language[languageKey]["FirstName"]}</label>
                        <p type="text" id="firstName" class="fixed-text"></p>
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

  async function loadProfileData() {
    try {
      const apiUrl = await getSecretValue("front/FRONT_API_PROFILE");
      const response = await axios.get(apiUrl);
      const data = response.data;
  
      // 기본 정보 업데이트
      document.getElementById("nickname").value = data.nickname || "";
      document.getElementById("lastName").textContent = data.last_name || "";
      document.getElementById("firstName").textContent = data.first_name || "";
      document.getElementById("edit-profile-email").textContent = data.email || "";
  
      // 프로필 이미지 업데이트 로직 수정
      if (data.profile_image) {
        // URL을 상대 경로로 변환
        let imageUrl = data.profile_image;
        
        // http:// 또는 https:// 로 시작하는 경우 도메인 이후의 경로만 추출
        if (imageUrl.startsWith('http')) {
          const urlObj = new URL(imageUrl);
          imageUrl = urlObj.pathname; // 예: /media/profile_images/image.jpg
        }
        
        const img = new Image();
        img.onload = () => {
          profileImage.src = imageUrl;
          deleteImageBtn.style.display = "block";
        };
        img.onerror = (e) => {
          profileImage.src = "default_profile.jpeg";
          deleteImageBtn.style.display = "none";
        };
        img.src = imageUrl;
      } else {
        profileImage.src = "default_profile.jpeg";
        deleteImageBtn.style.display = "none";
      }
    } catch (error) {
      alert(language[languageKey]["ErrorLoadingProfile"]);
    }
  }
  loadProfileData();
  let isImageDeleted = false;
  // 저장 버튼 핸들러도 수정
  saveProfileBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    // 입력값 검증
    const nickname = document.getElementById("nickname").value.trim();
    if (!nickname) {
      alert(language[languageKey]["NicknameRequired"]);
      return;
    }

    const formData = new FormData();
    formData.append("nickname", nickname);
  
    // 이미지 파일 처리
    const imageFile = imageUpload.files[0];
    if (imageFile) {
      formData.append("profile_image", imageFile);
      isImageDeleted = false; // 새 이미지가 업로드되면 삭제 상태 해제
    } else if (isImageDeleted) {
      // 이미지가 삭제된 상태라면 null을 전송
      formData.append("profile_image", "");
    }
    try {
      const apiUrl = await getSecretValue("front/FRONT_API_PROFILE");

      const profileResponse = await axios.put(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
        
      if (profileResponse.status === 200) {
        const myuserUrl = await getSecretValue("front/FRONT_API_MYUSER");
        await axios.patch(myuserUrl, { nickname });
        await loadProfileData();
        alert(language[languageKey]["ProfileUpdated"]);
        imageUpload.value = null;
      }
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      alert(language[languageKey]["ErrorUpdatingProfile"]);
    }
  });
  
  // 이미지 업로드 이벤트 핸들러 수정
  imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      // 파일 크기 체크 (예: 5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert(language[languageKey]["ImageSizeError"]);
        imageUpload.value = null;
        return;
      }
      
      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert(language[languageKey]["ImageTypeError"]);
        imageUpload.value = null;
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        profileImage.src = e.target.result;
        deleteImageBtn.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
  
  // 이미지 삭제 버튼 핸들러 수정
  deleteImageBtn.addEventListener("click", () => {
    profileImage.src = "default_profile.jpeg";
    imageUpload.value = null;
    deleteImageBtn.style.display = "none";
    isImageDeleted = true; // 이미지가 삭제되었음을 표시
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
}
