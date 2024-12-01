import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/LandingPage.scss";
import pingPongBall from "../../assets/ball.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-image-container">
        <img src={pingPongBall} alt="Ping Pong Ball" className="landing-image" />
      </div>

      {/* 각 버튼에 대해 절대 위치를 사용하여 이미지 위에 배치 */}
      <button className="landing-button home" onClick={() => navigate("/dashboard")}>
        Dashboard
      </button>
      <button className="landing-button single-play" onClick={() => navigate("/cpugame")}>
        single play
      </button>
      <button className="landing-button multi-play" onClick={() => navigate("/multygame")}>
        multiplay
      </button>
    </div>
  );
}




// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../../styles/LandingPage.scss"; // 스타일 파일 가져오기
// import pingPongBall from "../../assets/ball.png";

// export default function LandingPage() {
//   const navigate = useNavigate();

//   return (
//     <div className="landing-page">
//       <img src={pingPongBall} alt="Ping Pong Ball" className="landing-image" />

//       {/* 각 버튼에 대해 절대 위치를 사용하여 이미지 위에 배치 */}
//       <button className="landing-button home" onClick={() => navigate("/dashboard")}>
//         Dashboard
//       </button>
//       <button className="landing-button single-play" onClick={() => navigate("/cpugame")}>
//         single play
//       </button>
//       <button className="landing-button multi-play" onClick={() => navigate("/multygame")}>
//         multiplay
//       </button>
//     </div>
//   );
// }
