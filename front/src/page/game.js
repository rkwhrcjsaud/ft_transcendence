import * as THREE from 'three';
import { loadCSS } from '../utils/loadcss';
import { language } from "../utils/language"
import { createBall, createGameTexts, createLights, createPaddle, createTable, createTableLines } from './gameObjects';


let leftPaddle, rightPaddle, ball;
let scoreText, timeText;

export function loadGame() {
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
          // 패들의 3D 위치와 회전 업데이트
          leftPaddle.position.x = data.paddles.left.x;
          leftPaddle.position.y = data.paddles.left.y;
          leftPaddle.position.z = data.paddles.left.z;
  
          rightPaddle.position.x = data.paddles.right.x;
          rightPaddle.position.y = data.paddles.right.y;
          rightPaddle.position.z = data.paddles.right.z;
  
      } else if (data.type === "ball_update") {
          // 공의 3D 위치 업데이트
          ball.position.set(
              data.ball.x,
              data.ball.y,
              data.ball.z
          );
  
      } else if (data.type === "update") {
          // 전체 게임 상태 업데이트
          scores.left = data.scores.left;
          scores.right = data.scores.right;
          minutes = data.time.min;
          seconds = data.time.sec;
  
          // 패들과 공의 3D 위치 업데이트
          if (data.paddles) {
              leftPaddle.position.set(
                  data.paddles.left.x,
                  data.paddles.left.y,
                  data.paddles.left.z
              );
              rightPaddle.position.set(
                  data.paddles.right.x,
                  data.paddles.right.y,
                  data.paddles.right.z
              );
          }
  
          if (data.ball) {
              ball.position.set(
                  data.ball.x,
                  data.ball.y,
                  data.ball.z
              );
          }
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

    const camera = new THREE.PerspectiveCamera(60, 800 / 600, 0.1, 1000);
    camera.position.set(0, 700, 0);
    camera.lookAt(0, 0, 0);
    
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