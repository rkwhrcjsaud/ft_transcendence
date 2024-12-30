import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function initThreeScene(gameState, canvas) {
  // Scene, camera, and renderer setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.3, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(800, 600);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene.background = new THREE.Color(0x87ceeb); // 하늘색 배경 설정

  // Initialize game state
  gameState.leftScore = 0;
  gameState.rightScore = 0;
  gameState.time = 0;
  gameState.ballVelocity = new THREE.Vector3(0.02, 0.02, 0.01); // 포물선 운동 반영
  gameState.isStarted = false;
  gameState.keys = { ArrowUp: false, ArrowDown: false, w: false, s: false };
  gameState.lastHit = null; // "left" or "right"
  gameState.servePhase = true;

  // Lighting setup for realistic shadows
  setupLighting(scene);

  // Create table and net
  const { table, net } = createTableAndNet(scene);

  // Create paddles
  const { leftPaddle, rightPaddle } = createPaddles(scene);

  // Create ball
  const ball = createBall(scene);

  // Create score display and timer
  const { scoreText, timeText, countdownText } = createUIElements(scene);

  // Setup camera position and controls
  setupCamera(camera);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Add event listeners for keyboard input
  document.addEventListener('keydown', (event) => {
    if (event.key in gameState.keys) gameState.keys[event.key] = true;
  });

  document.addEventListener('keyup', (event) => {
    if (event.key in gameState.keys) gameState.keys[event.key] = false;
  });

  function setupLighting(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // 주변광
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 10, 10);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);
  }

  function createTableAndNet(scene) {
    const tableGeometry = new THREE.BoxGeometry(3, 0.1, 1.5);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = 0;
    table.castShadow = true;
    table.receiveShadow = true;
    scene.add(table);

    // Draw lines on the table
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    const centerLineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.5, 0.051, 0),
      new THREE.Vector3(1.5, 0.051, 0)
    ]);
    const centerLine = new THREE.Line(centerLineGeometry, lineMaterial);
    scene.add(centerLine);

    const borderLineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.5, 0.051, -0.75),
      new THREE.Vector3(1.5, 0.051, -0.75),
      new THREE.Vector3(1.5, 0.051, 0.75),
      new THREE.Vector3(-1.5, 0.051, 0.75),
      new THREE.Vector3(-1.5, 0.051, -0.75)
    ]);
    const borderLine = new THREE.Line(borderLineGeometry, lineMaterial);
    scene.add(borderLine);

    // Create mesh net
    const netGeometry = new THREE.PlaneGeometry(1.5, 0.2, 10, 20);
    const netMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const net = new THREE.Mesh(netGeometry, netMaterial);
    net.rotation.y = Math.PI / 2;
    net.position.set(0, 0.15, 0); // 네트 위치 조정
    scene.add(net);

    return { table, net };
  }

  function createPaddles(scene) {
    const paddleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.02, 32);
    const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 });

    const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    leftPaddle.position.set(-1.4, 0.15, 0); // 라켓 위치 조정
    leftPaddle.rotation.x = Math.PI / 2;
    leftPaddle.castShadow = true;
    scene.add(leftPaddle);

    const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    rightPaddle.position.set(1.4, 0.15, 0); // 라켓 위치 조정
    rightPaddle.rotation.x = Math.PI / 2;
    rightPaddle.castShadow = true;
    scene.add(rightPaddle);

    return { leftPaddle, rightPaddle };
  }

  function createBall(scene) {
    const ballGeometry = new THREE.SphereGeometry(0.05, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 0.2, 0);
    ball.castShadow = true;
    ball.receiveShadow = true;
    scene.add(ball);
    return ball;
  }

  function setupCamera(camera) {
    camera.position.set(0, 2, 4); // 카메라 위치 조정
    camera.lookAt(0, 0, 0);
  }

  function createUIElements(scene) {
    const scoreText = new Text();
    scoreText.text = "Score: 0 - 0";
    scoreText.fontSize = 0.2;
    scoreText.position.set(0, 2, -1);
    scoreText.color = 0x000000;
    scene.add(scoreText);

    const timeText = new Text();
    timeText.text = "Time: 00:00";
    timeText.fontSize = 0.2;
    timeText.position.set(0, 1.8, -1);
    timeText.color = 0x000000;
    scene.add(timeText);

    const countdownText = new Text();
    countdownText.text = ""; // 초기에는 비어 있음
    countdownText.fontSize = 0.4;
    countdownText.position.set(0, 2.5, -1);
    countdownText.color = 0xff0000;
    scene.add(countdownText);

    return { scoreText, timeText, countdownText };
  }

  function updateGameObjects(leftPaddle, rightPaddle, ball, gameState) {
    if (!gameState.isStarted) {
      const remainingTime = Math.max(0, 3 - gameState.time);
      countdownText.text = remainingTime > 0 ? `Game starts in: ${remainingTime.toFixed(1)}` : "";
      if (remainingTime === 0) {
        gameState.isStarted = true;
      }
      gameState.time += 0.016;
      return; // 게임 시작 전 대기
    }

    // Paddle movement
    if (gameState.keys.ArrowUp) rightPaddle.position.z = Math.max(-0.7, rightPaddle.position.z - 0.1);
    if (gameState.keys.ArrowDown) rightPaddle.position.z = Math.min(0.7, rightPaddle.position.z + 0.1);
    if (gameState.keys.w) leftPaddle.position.z = Math.max(-0.7, leftPaddle.position.z - 0.1);
    if (gameState.keys.s) leftPaddle.position.z = Math.min(0.7, leftPaddle.position.z + 0.1);

    // Ball movement
    ball.position.add(gameState.ballVelocity);

    // Ball collision with table boundaries
    if (ball.position.z > 0.75 || ball.position.z < -0.75) {
      gameState.ballVelocity.z *= -1;
    }
    if (ball.position.x > 1.5 || ball.position.x < -1.5) {
      if (gameState.servePhase) {
        // Check serve rule
        if (
          (gameState.lastHit === "left" && ball.position.x < 0) ||
          (gameState.lastHit === "right" && ball.position.x > 0)
        ) {
          console.log("Invalid serve! Point to opponent.");
          gameState.servePhase = true;
          gameState.lastHit = null;
          resetBall(ball, gameState);
          return;
        }
      } else {
        console.log("Out of bounds! Point to opponent.");
        gameState.servePhase = true;
        gameState.lastHit = null;
        resetBall(ball, gameState);
        return;
      }
    }

    // Check net collision
    if (Math.abs(ball.position.x) < 0.05 && ball.position.y < 0.2) {
      gameState.ballVelocity.x *= -1;
      console.log("Net collision!");
    }

    // Check paddle collision
    if (ball.position.distanceTo(leftPaddle.position) < 0.2) {
      gameState.ballVelocity.x = Math.abs(gameState.ballVelocity.x);
      gameState.lastHit = "left";
      gameState.servePhase = false;
    }
    if (ball.position.distanceTo(rightPaddle.position) < 0.2) {
      gameState.ballVelocity.x = -Math.abs(gameState.ballVelocity.x);
      gameState.lastHit = "right";
      gameState.servePhase = false;
    }

    // Gravity effect
    if (ball.position.y <= 0.2) {
      gameState.ballVelocity.y = Math.abs(gameState.ballVelocity.y) * 0.8;
    } else {
      gameState.ballVelocity.y -= 0.001;
    }
  }

  function resetBall(ball, gameState) {
    ball.position.set(0, 0.2, 0);
    gameState.ballVelocity.set(0.02, 0.02, 0.01);
    gameState.time = 0;
  }

  function updateUIElements(scoreText, timeText, gameState) {
    scoreText.text = `Score: ${gameState.leftScore} - ${gameState.rightScore}`;
    timeText.text = `Time: ${Math.floor(gameState.time / 60)}:${(Math.floor(gameState.time) % 60).toString().padStart(2, '0')}`;
  }

  function animate() {
    gameState.animationId = requestAnimationFrame(animate);

    updateGameObjects(leftPaddle, rightPaddle, ball, gameState);
    updateUIElements(scoreText, timeText, gameState);

    controls.update();
    renderer.render(scene, camera);
  }

  return { animate };
}
