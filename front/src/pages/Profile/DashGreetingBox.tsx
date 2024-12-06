import React from 'react';
import '../../styles/DashGreetingBox.scss';

const GreetingBox = () => {
  const postfix = '🏓핑퐁🏓 한 판 어떠세요?';

  // 시간대에 따라 `hours` 메시지를 반환하는 함수
  const getHoursMessage = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 11) {
      return '좋은 아침이예요.';
    } else if (currentHour >= 11 && currentHour < 18) {
      return '좋은 오후예요.';
    } else {
      return '좋은 저녁이예요.';
    }
  };

  // 시간대에 따라 `prefix` 메시지를 반환하는 함수
  const getGreetingMessage = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 11) {
      return `하루의 시작, ${postfix}`;
    } else if (currentHour >= 11 && currentHour < 14) {
      return `식후 ${postfix}`;
    } else if (currentHour >= 14 && currentHour < 18) {
      return `나른한 오후, ${postfix}`;
    } else if (currentHour >= 18 && currentHour < 21) {
      return `식후 ${postfix}`;
    } else {
      return `심심할 때 ${postfix}`;
    }
  };

  return (
    <div className="greeting-box">
      <div className="greeting-subbox">
        <h4 className="greeting-user">
          <strong>ranchoi 님! {getHoursMessage()}</strong>
        </h4>
        <div className="greeting-row">
          <p className="greeting-message">{getGreetingMessage()}</p>
          <button className="greeting-button">게임하러 가기</button>
        </div>
      </div>
    </div>
  );    
};

export default GreetingBox;
