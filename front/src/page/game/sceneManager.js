// sceneManager.js
import * as THREE from 'three';
import { Text } from 'troika-three-text';

export function initThreeScene(gameState, canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-400, 400, -300, 300, 1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas });

  setupScene(scene, camera, renderer);
  const { leftPaddle, rightPaddle, ball } = createGameObjects(scene);
  const { scoreText, timeText } = createUIElements(scene);

  function animate() {
    gameState.animationId = requestAnimationFrame(animate);
    updateGameObjects(leftPaddle, rightPaddle, ball, gameState);
    updateUIElements(scoreText, timeText, gameState);
    renderer.render(scene, camera);
  }

  return { animate };
}

function setupScene(scene, camera, renderer) {
  // Background
  const backgroundGeometry = new THREE.BoxGeometry(800, 600);
  const backgroundMaterial = new THREE.MeshStandardMaterial({ color: "skyblue" });
  const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  scene.add(background);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  const pointLight = new THREE.PointLight(0xffffff, 1, 3000, 0.01);
  pointLight.position.set(-200, -200, -150);
  scene.add(ambientLight);
  scene.add(pointLight);

  renderer.setSize(800, 600);
  camera.position.z = 600;
}

function createGameObjects(scene) {
  const paddleGeometry = new THREE.BoxGeometry(12, 120, 12);
  const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  
  const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
  const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
  
  leftPaddle.position.set(-354, 0, 6);  // 46px from left
  rightPaddle.position.set(354, 0, 6);  // 46px from right
  
  const ballGeometry = new THREE.SphereGeometry(6);
  const ballMaterial = new THREE.MeshStandardMaterial({ color: "white" });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0, 0, 6);

  scene.add(leftPaddle);
  scene.add(rightPaddle);
  scene.add(ball);

  return { leftPaddle, rightPaddle, ball };
}

function createUIElements(scene) {
  const scoreText = new Text();
  scoreText.text = "0 - 0";
  scoreText.fontSize = 100;
  scoreText.color = 0x000000;
  scoreText.position.set(0, -250, 0);
  scoreText.rotation.x = Math.PI;
  scoreText.textAlign = 'center';
  scoreText.anchorX = 'center';
  scoreText.anchorY = 'top';
  scoreText.sync();

  const timeText = new Text();
  timeText.text = "0:0";
  timeText.fontSize = 20;
  timeText.color = 0x000000;
  timeText.position.set(250, -250, 0);
  timeText.rotation.x = Math.PI;
  timeText.textAlign = 'right';
  timeText.anchorX = 'right';
  timeText.anchorY = 'top';
  timeText.sync();

  scene.add(scoreText);
  scene.add(timeText);

  return { scoreText, timeText };
}

function convertToThreeCoordinate(x, y, width, height) {
  return {
    x: (x - width / 2),
    y: (height / 2 - y)
  };
}

function updateGameObjects(leftPaddle, rightPaddle, ball, gameState) {
  leftPaddle.position.y = convertToThreeCoordinate(46, parseFloat(gameState.paddles.left.top) * 6, 800, 600).y;
  rightPaddle.position.y = convertToThreeCoordinate(754, parseFloat(gameState.paddles.right.top) * 6, 800, 600).y;
  
  const ballPos = convertToThreeCoordinate(
    parseFloat(gameState.ballPosition.x) * 8,
    parseFloat(gameState.ballPosition.y) * 6,
    800,
    600
  );
  ball.position.x = ballPos.x;
  ball.position.y = ballPos.y;
}

function updateUIElements(scoreText, timeText, gameState) {
  timeText.text = `${gameState.minutes}:${gameState.seconds}`;
  timeText.sync();
  scoreText.text = `${gameState.scores.left} - ${gameState.scores.right}`;
  scoreText.sync();
}