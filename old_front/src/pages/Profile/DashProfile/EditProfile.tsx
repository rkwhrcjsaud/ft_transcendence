import React, { useState } from "react";
import "../../../styles/EditProfile.scss";
import defaultProfilePic from "../../../assets/default_profile.jpeg";

const EditProfile = () => {
    const [profileImage, setProfileImage] = useState<string>(defaultProfilePic);
    const [isInputFocused, setIsInputFocused] = useState<string | null>(null);
    const [formData, setFormData] = useState({
      nickname: "잔뜩 겁먹은 햄찌222",
      lastName: "Choi",
      firstName: "Choi",
      email: "example@domain.com",
    });
  
    // 프로필 이미지 삭제 핸들러
    const handleDeleteProfileImage = () => {
      setProfileImage(defaultProfilePic);
    };
  
    // 프로필 이미지 업로드 핸들러
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
          setProfileImage(reader.result as string);
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    };
  
    // 입력창 포커스 핸들러
    const handleFocus = (inputName: string) => {
      setIsInputFocused(inputName);
    };
  
    // 입력창 블러 핸들러
    const handleBlur = () => {
      setIsInputFocused(null);
    };
  
    const labels = {
        nickname: "닉네임",
        lastName: "이름",
        firstName: "성",
        email: "이메일",
    };

    return (
      <div className="edit-profile-container">
        <h1 className="edit-profile-title">계정 정보 수정</h1>
        <div className="edit-profile-content">
        <div className="profile-section">
        <div className="profile-image-wrapper">
          <img src={profileImage} alt="Profile" className="profile-image" />
          {profileImage !== defaultProfilePic && (
            <button className="delete-image-btn" onClick={handleDeleteProfileImage}>
              &times;
            </button>
          )}
        </div>
        <label htmlFor="image-upload" className="upload-btn">
          사진 업로드
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        </div>
          <form className="edit-profile-form">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="form-group">
                <label className="form-label">{labels[key]}</label>
                <input
                  type="text"
                  className={`form-input ${isInputFocused === key ? "active" : ""}`}
                  value={value}
                  onFocus={() => handleFocus(key)}
                  onBlur={handleBlur}
                  readOnly={false}
                />
              </div>
            ))}
          </form>
        </div>
        <div className="form-buttons">
          <button type="button" className="cancel-btn">
            탈퇴하기
          </button>
          <button type="submit" className="save-btn">
            저장하기
          </button>
        </div>
      </div>
    );
  };
  
  export default EditProfile;