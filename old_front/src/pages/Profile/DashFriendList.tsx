import React, { useState } from "react";
import { AccordionItem, AccordionHeader, AccordionBody, UncontrolledAccordion } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSearch, faUserMinus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "../../styles/DashFriendList.scss";
import defaultProfilePic from "../../assets/default_profile.jpeg";

const DashFriendList = () => {
  const [isOpen, setIsOpen] = useState<string | null>("1");
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [searchResult, setSearchResult] = useState({
    avatar: defaultProfilePic,
    name: "testUser",
  }); // 임시 검색 결과 설정

  // 친구 목록 데이터
  const friends = [
    { id: 1, name: "gibkim", status: "online", avatar: defaultProfilePic },
    { id: 2, name: "haekang", status: "offline", avatar: defaultProfilePic },
    { id: 3, name: "jaehyji", status: "offline", avatar: defaultProfilePic },
  ];

  // 검색 이벤트 핸들러
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // 검색 결과를 가정
    if (e.target.value.toLowerCase() === "dongwook") {
      setSearchResult({
        name: "dongwook",
        avatar: defaultProfilePic,
      });
    } else {
      setSearchResult(null);
    }
  };

  // 아코디언 열림/닫힘 상태 관리
  const handleToggle = (id: string) => {
    setIsOpen(isOpen === id ? null : id);
  };

  return (
    <UncontrolledAccordion defaultOpen="1" id="dashFriendList" className="dashAccordion">
      {/* 친구 목록 */}
      <AccordionItem>
        <AccordionHeader
          targetId="1"
          className="custom-accordion-header"
          onClick={() => handleToggle("1")}
        >
          친구 목록 <span className="friend-count">{friends.length}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`accordion-icon ${isOpen === "1" ? "rotated" : ""}`}
          />
        </AccordionHeader>
        <AccordionBody accordionId="1" className="custom-accordion-body">
          <ul className="friend-list">
            {friends.map((friend) => (
              <li key={friend.id} className="friend-item">
                <img
                  src={friend.avatar}
                  alt={`${friend.name}'s profile`}
                  className="friend-avatar"
                />
                <div className="friend-info">
                  <div className="friend-name-container">
                    <span className="friend-name">{friend.name}</span>
                  </div>
                  <div className="friend-status-container">
                    <span className={`friend-status ${friend.status}`}>
                      <span className="status-indicator"></span>
                      {friend.status}
                    </span>
                  </div>
                </div>
                <button className="friend-remove-btn" title="Delete friend">
                  <FontAwesomeIcon icon={faUserMinus} />
                </button>
              </li>
            ))}
          </ul>

          {/* 친구 검색 */}
          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="친구를 찾아보세요!"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* 검색 결과 */}
          {searchResult && (
            <div className="search-results">
              <div className="search-result">
                <img
                  src={searchResult.avatar}
                  alt={`${searchResult.name}'s avatar`}
                  className="result-avatar"
                />
                <div className="result-info">
                  <span className="result-name">{searchResult.name}</span>
                </div>
                <button className="friend-add-btn">
                  <FontAwesomeIcon icon={faUserPlus} /> 친구 추가
                </button>
              </div>
            </div>
          )}

        </AccordionBody>
      </AccordionItem>
    </UncontrolledAccordion>
  );
};

export default DashFriendList;
