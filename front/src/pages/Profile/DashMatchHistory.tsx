import React, { useState } from "react";
import {
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  UncontrolledAccordion,
  CardGroup,
  Card,
  CardBody,
  CardTitle,
  CardText,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import defaultProfilePic from "../../assets/default_profile.jpeg";
import "../../styles/DashMatchHistory.scss";
const DashMatchHistory = () => {
  const [isOpen, setIsOpen] = useState<string | null>("1");
  
  // 아코디언 열림/닫힘 상태 관리
  const handleToggle = (id: string) => {
    setIsOpen(isOpen === id ? null : id);
  };

  // Mock 데이터
  const matchStats = {
    totalMatches: 7,
    wins: 4,
    losses: 2,
    draws: 1,
  };

  const matchHistory = [
    {
      id: 1,
      date: "12월 24일",
      user1: {
        name: "testUser1",
        avatar: defaultProfilePic,
      },
      user2: {
        name: "testUser2",
        avatar: defaultProfilePic,
      },
      score: "2 : 1",
    },
    {
      id: 2,
      date: "12월 20일",
      user1: {
        name: "testUser1",
        avatar: defaultProfilePic,
      },
      user2: {
        name: "testUser2",
        avatar: defaultProfilePic,
      },
      score: "1 : 2",
    },
  ];

  return (
    <UncontrolledAccordion defaultOpen="1" id="dashMatchHistory" className="dashAccordion">
      {/* 매치 히스토리 아코디언 */}
      <AccordionItem>
        <AccordionHeader
          targetId="1"
          className="custom-accordion-header"
          onClick={() => handleToggle("1")}
        >
          매치 히스토리
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`accordion-icon ${isOpen === "1" ? "rotated" : ""}`}
          />
        </AccordionHeader>
        <AccordionBody accordionId="1" className="custom-accordion-body">
          {/* 경기 통계 - CardGroup 사용 */}
          <CardGroup className="match-stats">
            <Card className="stat-box">
              <div className="stat-number-section">
                <CardTitle tag="h5" className="stat-number">
                  {matchStats.totalMatches}
                </CardTitle>
              </div>
              <CardBody className="stat-text-section">
                <CardText className="stat-label">TOTAL</CardText>
              </CardBody>
            </Card>
            <Card className="stat-box">
              <div className="stat-number-section">
                <CardTitle tag="h5" className="stat-number">
                  {matchStats.wins}
                </CardTitle>
              </div>
              <CardBody className="stat-text-section">
                <CardText className="stat-label">이긴 횟수</CardText>
              </CardBody>
            </Card>
            <Card className="stat-box">
              <div className="stat-number-section">
                <CardTitle tag="h5" className="stat-number">
                  {matchStats.losses}
                </CardTitle>
              </div>
              <CardBody className="stat-text-section">
                <CardText className="stat-label">진 횟수</CardText>
              </CardBody>
            </Card>
            <Card className="stat-box">
              <div className="stat-number-section">
                <CardTitle tag="h5" className="stat-number">
                  {matchStats.draws}
                </CardTitle>
              </div>
              <CardBody className="stat-text-section">
                <CardText className="stat-label">비긴 횟수</CardText>
              </CardBody>
            </Card>
          </CardGroup>

          {/* 매치 결과 리스트 */}
          <div className="match-history-list">
            {matchHistory.map((match) => (
              <div key={match.id} className="match-history-item">
                <img
                  src={match.user1.avatar}
                  alt={`${match.user1.name}'s avatar`}
                  className="match-avatar left-avatar"
                />
                <span className="match-user left-user">{match.user1.name}</span>
                <div className="match-detail">
                  <div className="match-date">{match.date}</div>
                  <div className="match-score">{match.score}</div>
                </div>
                <span className="match-user right-user">{match.user2.name}</span>
                <img
                  src={match.user2.avatar}
                  alt={`${match.user2.name}'s avatar`}
                  className="match-avatar right-avatar"
                />
              </div>
            ))}
          </div>
        </AccordionBody>
      </AccordionItem>
    </UncontrolledAccordion>
  );
};

export default DashMatchHistory;
