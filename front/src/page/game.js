import * as THREE from 'three';
import { loadCSS } from '../utils/loadcss';
import { language } from "../utils/language"
import { createBall, createGameTexts, createLights, createPaddle, createTable, createTableLines } from './gameObjects';
import Auth from '../auth/authProvider';
import { getMatchHistory, saveMatchHistory } from '../utils/matchhistory';

let paddles, ballPosition, leftPaddle, rightPaddle, ball;
let scoreText, timeText;

export async function loadGame() {
  loadCSS('../styles/game.css');
  const languageKey = localStorage.getItem("selectedLanguage");

  const html = `
    <div class="game-container">

      <div id="overlay" class="overlay"></div>
      <canvas id="pong-area" class="pong-area"></canvas>

      <div id="game-rules" class="game-rules">
        <Button id="start-game" class="start-game">
          ${language[languageKey]["Start"]}
        </Button>
        <h4 className="game-rules-title">${language[languageKey]["PongRules"]}</h4>
        <p>${language[languageKey]["FirstTo11"]}</p>
        <p>${language[languageKey]["LeftPlayer"]}</p>
        <p>${language[languageKey]["RightPlayer"]}</p>
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

  async function renderMessage() {
    if (message === 'menu') {
      overlay.addEventListener('click', handleOverlayClick);
      overlay.classList.add('game-over');
    }
    
    if (message !== 'none') {
      overlay.classList.remove('hidden');
      overlay.innerHTML = message;
      
      // 게임 시작 카운트다운인 경우
      if (message.includes('Game starts in')) {
        overlay.classList.remove('game-over');
      }
      // 게임 종료 메시지인 경우
      else if (message.includes('wins!') || message === 'Draw') {
        overlay.classList.add('game-over');
        await saveMatchHistory(Auth.getUser().id, 'guest', scores.left, scores.right);
        const data = await getMatchHistory(Auth.getUser().id);
        console.log(data);
      }
    } else {
      overlay.classList.add('hidden');
      overlay.classList.remove('game-over');
    }
  }

  function initWebSocket() {
    const username = "guest";
    ws = new WebSocket(`wss://localhost:443/ws/localgame/${username}/`);

    ws.onerror = (e) => {
      console.error("WebSocket error: ", e);
    };

    ws.onopen = () => {
      console.log("WebSocket opened");
    };

// game.js의 ws.onmessage 부분 수정
ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.type === "paddle_update") {
      // 2D 퍼센트 좌표를 3D 좌표로 변환
      const leftY = ((data.paddles.left.top / 100) * 600) - 300;  // 600은 height
      const rightY = ((data.paddles.right.top / 100) * 600) - 300;

      leftPaddle.position.set(-354, 0, leftY);    // x: -350 (왼쪽)
      rightPaddle.position.set(354, 0, rightY);   // x: 350 (오른쪽)
  } 
  else if (data.type === "ball_update") {
      // 2D 퍼센트 좌표를 3D 좌표로 변환
      const x = ((data.ball.x / 100) * 800) - 400;  // 800은 width
      const z = ((data.ball.y / 100) * 600) - 300;  // 600은 height

      // 공의 위치 업데이트
      const y = Math.abs(Math.cos((x / 400) * Math.PI));

      ball.position.set(x, 6 + 80 * y, z);
    }
  else if (data.type === "update") {
      // 점수와 시간 업데이트
      scores.left = data.scores.left;
      scores.right = data.scores.right;
      minutes = data.time.min;
      seconds = data.time.sec;

      // 패들과 공의 위치 업데이트
      if (data.paddles) {
          const leftY = ((data.paddles.left.top / 100) * 600) - 300;
          const rightY = ((data.paddles.right.top / 100) * 600) - 300;

          leftPaddle.position.set(-354, 0, leftY);
          rightPaddle.position.set(354, 0, rightY);
      }

      if (data.ball) {
          const x = ((data.ball.x / 100) * 800) - 400;
          const z = ((data.ball.y / 100) * 600) - 300;
          
          ball.position.set(x, 36, z);
      }
  } 
  else if (data.type === "message") {
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

    overlay.classList.add('hidden');
    overlay.classList.remove('game-over');
    gameRules.style.display = 'block';
    pongArea.style.display = 'none';
  };

  // WebSocket 이벤트 핸들러
  function handleKeyDown(event) {
    const key = event.key;
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
    }
    if (["w", "s", "ArrowUp", "ArrowDown"].includes(key) && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "keydown", key }));
    }
  }

  function handleKeyUp(event) {
    const key = event.key;
    if (["w", "s", "ArrowUp", "ArrowDown"].includes(key) && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "keyup", key }));
    }
  }

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Three.js 초기 설정
  function initGame() {

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // 오버레이 초기 설정
    overlay.classList.remove('hidden');
    overlay.classList.remove('game-over');

    const camera = new THREE.PerspectiveCamera(60, 800 / 600, 0.1, 1000);
    camera.position.set(0, 600, 300);
    camera.lookAt(0, 200, 100);
    
    const renderer = new THREE.WebGLRenderer({ 
        canvas: pongArea,
        antialias: true,
        alpha: true
    });
    renderer.setSize(800, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // 각 오브젝트 생성
    createLights(scene);
    createTable(scene);
    createTableLines(scene);
    
    leftPaddle = createPaddle(true);
    rightPaddle = createPaddle(false);
    scene.add(leftPaddle);
    scene.add(rightPaddle);
    
    ball = createBall(scene);
    
    const texts = createGameTexts(scene, scores, minutes, seconds);
    scoreText = texts.scoreText;
    timeText = texts.timeText;

    function animate() {
        animationId = requestAnimationFrame(animate);
        
        scoreText.text = `${scores.left} - ${scores.right}`;
        timeText.text = `${minutes}:${seconds}`;
        scoreText.sync();
        timeText.sync();
        
        renderer.render(scene, camera);
    }
    
    animate();
  }
}