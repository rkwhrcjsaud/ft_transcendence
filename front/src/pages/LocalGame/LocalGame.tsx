import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardText, Button, Container } from "reactstrap";
import LocalGamePaddle from "./LocalGamePaddle.tsx";
import Ball from "./Ball.tsx";
import { useLoaderData } from "react-router-dom";
import { ScoreBoard, Timer } from "./LocalGameStyles.tsx"
import "./LocalGameStyles.css";

interface User {
    id: number;
    username: string;
}

export default function LocalGame() {
    const [roomState, setRoomState] = useState("1");
    const user = useLoaderData() as User;
    const [message, setMessage] = useState("");
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [localPaddleTop, setLocalPaddleTop] = useState({
        left: { top: '40%' },
        right: { top: '40%' }
    })
    const [ballPosition, setBallPosition] = useState({
        x: '50%',
        y: '50%'
    })

    const [leftScore, setLeftScore] = useState(0);
    const [rightScore, setRightScore] = useState(0);
    const [minutes, setminutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const handleStartButton = () => {
        console.log("start button clicked");
        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log("sending start_game message");
            ws.send(JSON.stringify({ type: "start_game" }));
            setRoomState("2");
        } else {
            console.error("ws is not open");
        }
    };

    useEffect(() => {
        const username = user.username || "guest"; // 사용자의 이름을 지정
        console.log("username: ", username);
        const newWs = new WebSocket(`wss://localhost:443/ws/localgame/${username}/`);

        // ws 실패 시 콘솔에 에러 메시지 출력
        newWs.onerror = (error) => {
            console.error(error);
        };

        newWs.onopen = () => {
            console.log("ws opened");
            setWs(newWs);
        };

        newWs.onmessage = (message) => {
            console.log("message received");
            const data = JSON.parse(message.data);
            if (data.type === "paddle_update") {
                setLocalPaddleTop({
                    left: { top: `${data.paddles.left.top}%` },
                    right: { top: `${data.paddles.right.top}%` }
                });
            } else if (data.type === "ball_update") {
                setBallPosition({
                    x: `${data.ball.x}%`,
                    y: `${data.ball.y}%`
                });
            } else if (data.type === "update") {
                setLeftScore(data.scores.left);
                setRightScore(data.scores.right);
                setminutes(data.time.min);
                setSeconds(data.time.sec);
            } else if (data.type === "message") {
                if (data.message === "MENU") {
                    setRoomState("1");
                }
                setMessage(data.message);
            }
        };

        newWs.onclose = () => {
            console.log("ws closed");
            setWs(null);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;
            if ([ "w", "s", "ArrowUp", "ArrowDown" ].includes(key) && newWs.readyState === WebSocket.OPEN) {
                newWs.send(JSON.stringify({ type: "keydown", key }));
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const key = event.key;
            if ([ "w", "s", "ArrowUp", "ArrowDown" ].includes(key) && newWs.readyState === WebSocket.OPEN) {
                newWs.send(JSON.stringify({ type: "keyup", key }));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            if (newWs.readyState === WebSocket.OPEN) {
                newWs.close();
            }
        };
    }, [user.username]);

    return (
        <>
            {roomState === "1" && (
                <Container className="h-100 overflow-auto">
                    <Button color="info" className="absoluteButton" onClick={handleStartButton}>
                        Start
                    </Button>
                    <Card className="bg-black">
                        <CardBody className="text-light">
                            <CardTitle>Pong Rules:</CardTitle>
                            <CardText>
                                <span>The first player to 10 points, or with the most points when the time runs out wins!</span>
                            </CardText>
                            <CardText>
                                <b className="text-primary">Left</b> player controls: W (up), S (down).
                            </CardText>
                            <CardText>
                                <b className="text-primary">Right</b> player controls: ArrowUp (up), ArrowDown (down).
                            </CardText>
                        </CardBody>
                    </Card>
                </Container>
            )}
            {roomState === "2" && (
                <div className="pongArea">
                <div
                  className="overlay"
                  style={{ visibility: message === "none" ? "hidden" : "visible" }}
                >
                  {message}
                </div>
                <div className="middleLine"></div>
                <div className="centerCircle"></div>
                <LocalGamePaddle key="1" color="red" left="1.25" top={localPaddleTop.left.top} />
                <LocalGamePaddle key="2" color="blue" left="94.75" top={localPaddleTop.right.top} />
                <Ball left={ballPosition.x} top={ballPosition.y} />
                <ScoreBoard leftScore={leftScore} rightScore={rightScore} />
                <Timer minutes={minutes} seconds={seconds} />
              </div>
            )}
        </>
    );
}
