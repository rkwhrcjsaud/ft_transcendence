import React from "react";

interface LocalGamePaddleProps {
  color: string;
  left: string; // 화면의 좌측 위치 (%)
  top: string;  // 화면의 상단 위치 (%)
}

const LocalGamePaddle: React.FC<LocalGamePaddleProps> = ({ color, left, top }) => {
  const paddleRef = React.useRef<any>();

  // left와 top을 0~1 사이의 값으로 변환 (각각 화면 좌측/상단 기준)
  const xPos = (parseFloat(left) - 50) / 50; // [0, 100]% 기준 -> [-1, 1]로 변환
  const yPos = (parseFloat(top) - 50) / 50; // [0, 100]% 기준 -> [-1, 1]로 변환

  // cylinderGeometry의 높이는 0.4이므로 패들의 상단이 top에 맞춰지도록 위치 조정
  const adjustedYPos = yPos + 0.2; // yPos + 0.4/2 (0.4는 패들의 높이)

  return (
    <mesh ref={paddleRef} position={[xPos, adjustedYPos, 0]}>
      <cylinderGeometry args={[0.03, 0.03, 0.4, 32]} /> {/* 반지름 0.1, 높이 0.4, 32는 원의 세그먼트 수 */}
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default LocalGamePaddle;
