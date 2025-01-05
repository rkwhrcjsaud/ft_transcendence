import * as THREE from 'three';
import { loadCSS } from '../utils/loadcss';
import { language } from "../utils/language"
import { createBall, createGameTexts, createLights, createPaddle, createTable, createTableLines, createCamera } from './gameObjects';
import { updateTrailEffect } from './gameEffect';

import Auth from '../auth/authProvider';
import { saveMatchHistory } from '../utils/matchhistory';

let scene, renderer;
let paddles, ballPosition, leftPaddle, rightPaddle, ball;
let scoreText, timeText;

let ws = null;
let animationId = null;
let gameState = '1';
let scores = { left: 0, right: 0 };
let minutes = 0;
let seconds = 0;
let message = 'none';

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

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "paddle_update") {
        // 2D 퍼센트 좌표를 3D 좌표로 변환
        const leftY = ((data.paddles.left.top / 100) * 600) - 300;  // 600은 height
        const rightY = ((data.paddles.right.top / 100) * 600) - 300;

        // 최대 기울기 각도 (90도)를 라디안으로 변환
        const MAX_TILT = Math.PI / 2;
        
        // y 위치의 최대값 (절대값)
        const MAX_Y = 300;
        
        // y 위치에 따른 기울기 계산 (절대값이 클수록 더 많이 기울어짐)
        const leftTiltX = (Math.abs(leftY) / MAX_Y) * MAX_TILT;
        const rightTiltX = (Math.abs(rightY) / MAX_Y) * MAX_TILT;
        
        // 위로 움직일 때는 앞으로(-), 아래로 움직일 때는 뒤로(+) 기울어지도록 부호 조정
        const leftFinalTilt = leftY > 0 ? leftTiltX : -leftTiltX;
        const rightFinalTilt = rightY > 0 ? rightTiltX : -rightTiltX;

        // 위치 업데이트
        leftPaddle.position.set(-354, 75, leftY);
        rightPaddle.position.set(354, 75, rightY);
        
        // 회전 업데이트 (X축 기준 회전)
        leftPaddle.rotation.x = leftFinalTilt;
        rightPaddle.rotation.x = rightFinalTilt;
        
      }
      else if (data.type === "ball_update") {
        // 2D 퍼센트 좌표를 3D 좌표로 변환
        const x = ((data.ball.x / 100) * 800) - 400;
        const z = ((data.ball.y / 100) * 600) - 300;
        
        // 공의 높이를 x 위치에 따라 동적으로 계산
        const y = Math.abs(Math.cos((x / 400) * Math.PI));
        const newY = 10 + 80 * y;
        
        ball.position.set(x, newY, z);
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

            leftPaddle.position.set(-354, 75, leftY);
            rightPaddle.position.set(354, 75, rightY);
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
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // 오버레이 초기 설정
    overlay.classList.remove('hidden');
    overlay.classList.remove('game-over');
    
    renderer = new THREE.WebGLRenderer({ 
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
    
    const ballObjects = createBall(scene);
    ball = ballObjects.ball;

    const texts = createGameTexts(scene, scores, minutes, seconds);
    scoreText = texts.scoreText;
    timeText = texts.timeText;

    const camera = createCamera();

    let lastTime = performance.now();

    function animate() {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      animationId = requestAnimationFrame(animate);

      scoreText.text = `${scores.left} - ${scores.right}`;
      timeText.text = `${minutes}:${seconds}`;
      scoreText.sync();
      timeText.sync();

      updateTrailEffect(ball, deltaTime / 1000);

      texts.updateHologramEffect();
      texts.updateTextOrientation(camera);
      renderer.render(scene, camera);
    }
    
    animate();
  }
}