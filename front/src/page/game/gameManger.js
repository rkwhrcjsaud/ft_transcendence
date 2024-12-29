// gameManager.js
import { initWebSocket } from './webSocketManager';
import { initThreeScene } from './sceneManager';
import { setupUI } from './uiManager';
import { GameState } from './gameState';
import { loadCSS } from '../../utils/loadcss';

export function loadMultyGame() {
  loadCSS('../../styles/multyGame.css');
  const gameState = new GameState();
  const ws = initWebSocket(gameState);
  const { elements, updateUI } = setupUI(gameState, ws);
  let sceneManager = null;

  function initGame() {
    elements.pongArea.style.display = 'block';
    elements.overlay.style.display = 'block';
    sceneManager = initThreeScene(gameState, elements.pongArea);
    sceneManager.animate();
  }

  function resetGame() {
    if (gameState.animationId) {
      cancelAnimationFrame(gameState.animationId);
      gameState.animationId = null;
    }
    gameState.reset();
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'reset_game' }));
    }

    updateUI('reset');
  }

  // 이벤트 리스너 설정
  elements.startGame.addEventListener('click', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'start_game' }));
      gameState.gameState = '2';
      updateUI('start');
      initGame();
    }
  });

  elements.overlay.addEventListener('click', () => {
    if (gameState.message === 'menu') {
      resetGame();
    }
  });

  return { initGame, resetGame };
}