let ws;
let roomState = "1"; // 게임 상태 (1: 대기, 2: 게임 진행 중)
let message = "";
let leftScore = 0;
let rightScore = 0;
let minutes = 0;
let seconds = 0;
let paddleLeftTop = "40%";
let paddleRightTop = "40%";
let ballPosition = { x: "50%", y: "50%" };

function loadMultyGame(username = "guest") {
  const content = document.getElementById("app");
  content.innerHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pong Game</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div id="game-container">
      <button id="start-button">Start</button>
      <div id="game-info">
        <h4>Pong Rules:</h4>
        <p>The first player to 11 points, or with the most points when the time runs out wins!</p>
        <p><b>Left</b> player controls: W (up), S (down).</p>
        <p><b>Right</b> player controls: ArrowUp (up), ArrowDown (down).</p>
      </div>
      <canvas id="game-canvas" width="800" height="600"></canvas>
      <div id="scoreboard">
        <span id="left-score">Left: 0</span>
        <span id="right-score">Right: 0</span>
      </div>
      <div id="timer">00:00</div>
    </div>
    <script src="game.js"></script>
  </body>
  </html>
  `;

  const startButton = document.getElementById("start-button");
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const leftScoreElement = document.getElementById("left-score");
  const rightScoreElement = document.getElementById("right-score");
  const timerElement = document.getElementById("timer");
  const gameInfoElement = document.getElementById("game-info");

  ws = new WebSocket(`wss://localhost:443/ws/localgame/${username}/`);

  ws.onerror = (error) => {
    console.error(error);
  };

  ws.onopen = () => {
    console.log("ws opened");
  };

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.type === "paddle_update") {
      paddleLeftTop = data.paddles.left.top;
      paddleRightTop = data.paddles.right.top;
    } else if (data.type === "ball_update") {
      ballPosition = data.ball;
    } else if (data.type === "update") {
      leftScore = data.scores.left;
      rightScore = data.scores.right;
      minutes = data.time.min;
      seconds = data.time.sec;
    } else if (data.type === "message") {
      if (data.message === "MENU") {
        roomState = "1";
      }
      message = data.message;
    }
    updateGameState();
  };

  ws.onclose = () => {
    console.log("ws closed");
    ws = null;
  };

  startButton.addEventListener("click", () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "start_game" }));
      roomState = "2";
    } else {
      console.error("WebSocket is not open");
    }
  });

  function handleKeyDown(event) {
    const key = event.key;
    if (
      ["w", "s", "ArrowUp", "ArrowDown"].includes(key) &&
      ws.readyState === WebSocket.OPEN
    ) {
      ws.send(JSON.stringify({ type: "keydown", key }));
    }
  }

  function handleKeyUp(event) {
    const key = event.key;
    if (
      ["w", "s", "ArrowUp", "ArrowDown"].includes(key) &&
      ws.readyState === WebSocket.OPEN
    ) {
      ws.send(JSON.stringify({ type: "keyup", key }));
    }
  }

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // 게임 상태 업데이트
  function updateGameState() {
    leftScoreElement.textContent = `Left: ${leftScore}`;
    rightScoreElement.textContent = `Right: ${rightScore}`;
    timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  // 게임 렌더링
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 왼쪽 패들
    ctx.fillStyle = "#FFA500";
    ctx.fillRect(10, parseInt(paddleLeftTop), 20, 100);

    // 오른쪽 패들
    ctx.fillStyle = "#FF7F00";
    ctx.fillRect(canvas.width - 30, parseInt(paddleRightTop), 20, 100);

    // 공
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(
      parseInt(ballPosition.x),
      parseInt(ballPosition.y),
      10,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // 게임 루프
  function gameLoop() {
    if (roomState === "2") {
      draw();
    }
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

export { loadMultyGame };
