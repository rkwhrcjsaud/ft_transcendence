// webSocketManager.js
export function initWebSocket(gameState) {
  const username = 'guest';
  
  // 환경에 따른 WebSocket 설정
  const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
  
  // 개발 환경에서는 ws://, 프로덕션에서는 wss:// 사용
  const protocol = isDevelopment ? 'ws:' : 'wss:';
  const host = window.location.hostname;
  const port = isDevelopment ? ':8000' : '';
  
  const wsUrl = `${protocol}//${host}${port}/ws/localgame/${username}/`;
  console.log('Attempting to connect to:', wsUrl); // 연결 URL 로깅
  
  const ws = new WebSocket(wsUrl);

  // 연결 상태 모니터링을 위한 변수들
  let isConnected = false;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;

  ws.onerror = (e) => {
    console.error("WebSocket connection error:", e);
    console.log("Current WebSocket state:", ws.readyState);
    console.log("Connection URL:", wsUrl);
    
    // 연결이 이미 수립되었었는지 확인
    if (isConnected) {
      console.log("Connection lost after successful connection");
    } else {
      console.log("Failed to establish initial connection");
    }

    // 재연결 로직
    if (reconnectAttempts < maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
      console.log(`Attempting to reconnect in ${delay/1000} seconds... (Attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
      
      setTimeout(() => {
        reconnectAttempts++;
        initWebSocket(gameState);
      }, delay);
    } else {
      console.error("Maximum reconnection attempts reached");
    }
  };

  ws.onopen = () => {
    console.log("WebSocket connected successfully to:", wsUrl);
    isConnected = true;
    reconnectAttempts = 0; // 성공적인 연결 후 재시도 카운트 리셋
  };

  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      gameState.updateFromMessage(data);
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  ws.onclose = (e) => {
    console.log("WebSocket connection closed:", e.code, e.reason);
    isConnected = false;
    
    // 정상적인 종료가 아닌 경우에만 재연결 시도
    if (e.code !== 1000) {
      ws.onerror(new Event('error'));
    }
    
    return null;
  };

  // 페이지 언로드 시 연결 정리
  window.addEventListener('beforeunload', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close(1000, "Page unloading");
    }
  });

  return ws;
}