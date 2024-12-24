import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { loadCSS } from '../utils/loadcss';

export function loadMultyGame() {
  loadCSS('../styles/multyGame.css');

  const html = `
    <div class="game-container">

      <div id="overlay" class="overlay"></div>
      <canvas id="pong-area" class="pong-area"></canvas>

      <div id="game-rules" class="game-rules">
        <Button id="start-game" class="start-game">
          Start
        </Button>
        <h4 className="game-rules-title">Pong Rules:</h4>
        <p>The first player to 11 points, or with the most points when the time runs out wins!</p>
        <p><b>Left</b> player controls: W (up), S (down).</p>
        <p><b>Right</b> player controls: ArrowUp (up), ArrowDown (down).</p>
      </div>
    </div>
  `

  document.getElementById('app').innerHTML = html;

  const pongArea = document.getElementById('pong-area');
  const startGame = document.getElementById('start-game');
  const gameRules = document.getElementById('game-rules');
  const overlay = document.getElementById('overlay');

  let ws = null;
  let animationId = null;
  let gameState = '1';
  let paddles = {
    left: { top: "50%" },
    right: { top: "50%" }
  };
  let ballPosition = { x: "50%", y: "50%" };
  let scores = { left: 0, right: 0 };
  let minutes = 0;
  let seconds = 0;
  let message = 'none';

  startGame.addEventListener('click', () => {
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify({ type: 'start_game' }));
      gameState = '2';
      gameRules.style.display = 'none';
      pongArea.style.display = 'block';
      initGame();
    }
  });

  function handleOverlayClick() {
    reset_game();
    overlay.removeEventListener('click', handleOverlayClick);
  };

  function renderMessage() {
    if (message === 'menu')
      overlay.addEventListener('click', handleOverlayClick);
    if (message !== 'none') {
      overlay.style.visibility = 'visible';
      overlay.innerHTML = message;
    } else {
      overlay.style.visibility = 'hidden';
    }
  };

  const scoreText = new Text();
  scoreText.text = `${scores.left} - ${scores.right}`;
  scoreText.fontSize = 100;
  scoreText.color = 0x000000;
  scoreText.position.set(0, -250, 0);
  scoreText.rotation.x = Math.PI;
  scoreText.textAlign = 'center';
  scoreText.anchorX = 'center';
  scoreText.anchorY = 'top';
  scoreText.sync();

  const timeText = new Text();
  timeText.text = `${minutes}:${seconds}`;
  timeText.fontSize = 20;
  timeText.color = 0x000000;
  timeText.position.set(250, -250, 0);
  timeText.rotation.x = Math.PI;
  timeText.textAlign = 'right';
  timeText.anchorX = 'right';
  timeText.anchorY = 'top';
  timeText.sync();

  function initWebSocket() {
    const username = 'guest';
    ws = new WebSocket(`wss://localhost:443/ws/localgame/${username}/`);

    ws.onerror = (e) => {
      console.error("WebSocket error: ", e);
    };

    ws.onopen = () => {
      console.log("WebSocket opened");
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "paddle_update") {
        paddles.left.top = data.paddles.left.top;
        paddles.right.top = data.paddles.right.top;
      } else if (data.type === "ball_update") {
        ballPosition.x = data.ball.x;
        ballPosition.y = data.ball.y;
      } else if (data.type === "update") {
        scores.left = data.scores.left;
        scores.right = data.scores.right;
        minutes = data.time.min;
        seconds = data.time.sec;
      } else if (data.type === "message") {
        message = data.message;
        renderMessage();
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      ws = null;
    };
  }

  initWebSocket();

  function reset_game() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    gameState = '1';
    scores = { left: 0, right: 0 };
    paddles = {
      left: { top: "50%" },
      right: { top: "50%" }
    };
    ballPosition = { x: "50%", y: "50%" };
    minutes = 0;
    seconds = 0;
    message = 'none';

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'reset_game' }));
    }

    overlay.style.display = 'none';
    gameRules.style.display = 'block';
    pongArea.style.display = 'none';
  };

  function handleKeyDown(event) {
    const key = event.key;
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
    }
    if (["w", "s", "ArrowUp", "ArrowDown"].includes(key) && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "keydown", key }));
    }
  };

  function handleKeyUp(event) {
    const key = event.key;
    if (["w", "s", "ArrowUp", "ArrowDown"].includes(key) && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "keyup", key }));
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  function initGame() {
    pongArea.style.display = 'visible';
    overlay.style.display = 'block';
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-400, 400, -300, 300, 1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: pongArea });

    const backgroundGeometry = new THREE.BoxGeometry(800, 600);
    const backgroundMaterial = new THREE.MeshStandardMaterial({ color: "skyblue" });
    const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    background.position.set(0, 0, 0);
    scene.add(background);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 3000, 0.01);
    pointLight.position.set(-200, -200, -150);
    scene.add(pointLight);
    renderer.setSize(800, 600);
    camera.position.z = 600;

    overlay.style.width = "800px";
    overlay.style.height = "600px";
    const rect = pongArea.getBoundingClientRect();
    overlay.style.top = rect.top + "px";
    overlay.style.left = rect.left + "px";

    function convertToThreeCoordinate(x, y, width, height) {
      return {
        x: (x - width / 2),
        y: (height / 2 - y)
      };
    }

    const leftPaddlePosition = convertToThreeCoordinate(46, 300, 800, 600);
    const rightPaddlePosition = convertToThreeCoordinate(754, 300, 800, 600);
    const convertBallPosition = convertToThreeCoordinate(400, 300, 800, 600);

    const paddleGeometry = new THREE.BoxGeometry(12, 120, 12);
    const paddleMeterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMeterial);
    const RightPaddle = new THREE.Mesh(paddleGeometry, paddleMeterial);
    leftPaddle.position.set(leftPaddlePosition.x, leftPaddlePosition.y, 6);
    RightPaddle.position.set(rightPaddlePosition.x, rightPaddlePosition.y, 6);

    const ballGeometry = new THREE.SphereGeometry(6);
    const ballMaterial = new THREE.MeshStandardMaterial({ color: "white" });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(convertBallPosition.x, convertBallPosition.y, 6);

    scene.add(leftPaddle);
    scene.add(RightPaddle);
    scene.add(ball);
    scene.add(scoreText);
    scene.add(timeText);

    function animate() {
      animationId = requestAnimationFrame(animate);
      leftPaddle.position.y = convertToThreeCoordinate(46, parseFloat(paddles.left.top) * 6, 800, 600).y;
      RightPaddle.position.y = convertToThreeCoordinate(754, parseFloat(paddles.right.top) * 6, 800, 600).y;
      const temp = convertToThreeCoordinate(parseFloat(ballPosition.x) * 8, parseFloat(ballPosition.y) * 6, 800, 600);
      ball.position.x = temp.x;
      ball.position.y = temp.y;
      timeText.text = `${minutes}:${seconds}`;
      timeText.sync();
      scoreText.text = `${scores.left} - ${scores.right}`;
      scoreText.sync();
      renderer.render(scene, camera);
    }

    animate();
  };
}