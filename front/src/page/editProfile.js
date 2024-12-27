import { loadCSS } from "../utils/loadcss";
import { language } from "../utils/language";

export function loadEditProfile() {
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
                        <label class="form-label">${language[languageKey]["Nickname"]}</label>
                        <input type="text" id="nickname" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">${language[languageKey]["LastName"]}</label>
                        <input type="text" id="lastName" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">${language[languageKey]["FirstName"]}</label>
                        <input type="text" id="firstName" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">${language[languageKey]["Email"]}</label>
                        <input type="text" id="email" class="form-input">
                    </div>
                </form>
                <div class="form-buttons">
                    <button type="button" class="edit-profile-cancel-btn">${language[languageKey]["DeleteAccount"]}</button>
                    <button type="submit" class="edit-profile-save-btn">${language[languageKey]["Save"]}</button>
                </div>
            </div>
        </div>
    </div>`;

    document.getElementById('app').innerHTML = html;

    // JavaScript 로직
    const profileImage = document.getElementById('profileImage');
    const deleteImageBtn = document.getElementById('deleteImageBtn');
    const imageUpload = document.getElementById('imageUpload');

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImage.src = e.target.result;
                deleteImageBtn.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    deleteImageBtn.addEventListener('click', () => {
        profileImage.src = 'default_profile.jpeg';
    });

    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            e.target.classList.add('active');
        });

        input.addEventListener('blur', (e) => {
            e.target.classList.remove('active');
        });
    });
}
