import React, { useState } from "react";
import { AccordionItem, AccordionHeader, AccordionBody, UncontrolledAccordion } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCog, faLock } from "@fortawesome/free-solid-svg-icons";
import defaultProfilePic from "../../assets/default_profile.jpeg";
import "../../styles/DashProfile.scss";

const ProfileAccordion = () => {
  const [isOpen, setIsOpen] = useState<string | null>("1"); // 아코디언 상태 관리

  const handleToggle = (id: string) => {
    setIsOpen(isOpen === id ? null : id); // 클릭 시 열림/닫힘 상태 변경
  };

  return (
    <UncontrolledAccordion defaultOpen="1" id="dashProfile" className="dashAccordion">
      <AccordionItem>
        <AccordionHeader
          targetId="1"
          className="custom-accordion-header"
          onClick={() => handleToggle("1")} // 상태 변경
        >
          프로필
          {/* 단일 아이콘 사용 */}
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`accordion-icon ${isOpen === "1" ? "rotated" : ""}`} // 상태에 따라 클래스 추가
          />
        </AccordionHeader>
        <AccordionBody accordionId="1" className="custom-accordion-body">
          <div className="profile-container">
            <div className="profile-image">
              <img src={defaultProfilePic} alt="Profile" />
            </div>
            <h2 className="profile-name">ranchoi</h2>
            <div className="profile-buttons">
              <button className="profile-button profile-setting-btn">
                <FontAwesomeIcon icon={faCog} /> 프로필 수정
              </button>
              <button className="profile-button">
                <FontAwesomeIcon icon={faLock} /> 비밀번호 변경
              </button>
            </div>
          </div>
        </AccordionBody>
      </AccordionItem>
    </UncontrolledAccordion>
  );
};

export default ProfileAccordion;
