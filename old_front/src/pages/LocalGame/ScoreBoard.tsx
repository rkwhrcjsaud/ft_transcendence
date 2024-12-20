import React from "react";
import { Text } from "@react-three/drei";

interface ScoreBoardProps {
  leftScore: number;
  rightScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ leftScore, rightScore }) => {
  return (
    <>
      <Text position={[-0.4, 0.9, 0]} fontSize={0.1} color="black">
        {leftScore}
      </Text>
      <Text position={[0.4, 0.9, 0]} fontSize={0.1} color="black">
        {rightScore}
      </Text>
    </>
  );
};

export default ScoreBoard;
