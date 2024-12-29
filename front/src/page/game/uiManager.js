// uiManager.js
import { language } from "../../utils/language";

export function setupUI(gameState, ws) {
  const languageKey = localStorage.getItem("selectedLanguage");
  const html = createHTML(languageKey);
  document.getElementById('app').innerHTML = html;

  const elements = {
    pongArea: document.getElementById('pong-area'),
    startGame: document.getElementById('start-game'),
    gameRules: document.getElementById('game-rules'),
    overlay: document.getElementById('overlay'),
  };

  setupKeyboardControls(ws);

  function updateUI(action) {
    switch (action) {
      case 'start':
        elements.gameRules.style.display = 'none';
        elements.pongArea.style.display = 'block';
        break;
      case 'reset':
        elements.overlay.style.display = 'none';
        elements.gameRules.style.display = 'block';
        elements.pongArea.style.display = 'none';
        break;
    }

    // Update overlay message
    if (gameState.message !== 'none') {
      elements.overlay.style.visibility = 'visible';
      elements.overlay.innerHTML = gameState.message;
    } else {
      elements.overlay.style.visibility = 'hidden';
    }
  }

  return { elements, updateUI };
}

function createHTML(languageKey) {
  return `
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
  `;
}

function setupKeyboardControls(ws) {
  window.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
    }
    if (["w", "s", "ArrowUp", "ArrowDown"].includes(key) && ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "keydown", key }));
    }
  });

  window.addEventListener('keyup', (event) => {
    const key = event.key;
    if (["w", "s", "ArrowUp", "ArrowDown"].includes(key) && ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "keyup", key }));
    }
  });
}