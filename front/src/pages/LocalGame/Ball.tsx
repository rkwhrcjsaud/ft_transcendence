import React from "react";
import { useFrame } from "@react-three/fiber";

interface BallProps {
  left: string;
  top: string;
}

const Ball: React.FC<BallProps> = ({ left, top }) => {
  const ballRef = React.useRef<any>();

  useFrame(() => {
    // left와 top을 3D 좌표로 변환
    const x = (parseFloat(left) - 50) / 50; // [-1, 1]로 변환
    const y = (parseFloat(top) - 50) / 50;

    if (ballRef.current) {
      ballRef.current.position.x = x;
      ballRef.current.position.y = y;
    }
  });

  return (
    <mesh ref={ballRef}>
      <sphereGeometry args={[0.02, 32, 32]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

export default Ball;
