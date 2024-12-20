import React, { useEffect, useState } from "react";
import { Text } from "@react-three/drei";

interface TimerProps {
  minutes: number;
  seconds: number;
}

const Timer: React.FC<TimerProps> = ({ minutes, seconds }) => {
  const [timeLeft, setTimeLeft] = useState<string>(`${minutes}:${seconds}`);

  useEffect(() => {
    setTimeLeft(`${minutes}:${seconds}`);
  }, [minutes, seconds]);

  return (
    <Text position={[0, 0.9, 0]} fontSize={0.1} color="black">
      {timeLeft}
    </Text>
  );
};

export default Timer;
