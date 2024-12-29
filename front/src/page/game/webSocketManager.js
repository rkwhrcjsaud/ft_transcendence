// webSocketManager.js
export function initWebSocket(gameState) {
  const username = 'guest';
  const ws = new WebSocket(`wss://localhost:443/ws/localgame/${username}/`);

  ws.onerror = (e) => console.error("WebSocket error: ", e);
  ws.onopen = () => console.log("WebSocket opened");

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    gameState.updateFromMessage(data);
  };

  ws.onclose = () => {
    console.log("WebSocket closed");
    return null;
  };

  return ws;
}