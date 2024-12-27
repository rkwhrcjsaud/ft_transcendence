import { loadCSS } from "../utils/loadcss";

export function loadLanding() {
  loadCSS("../styles/landing.css");

  const html = `
    <div class="landing-page">
      <div class="ball-container">
        <img src="/ball.png" alt="Ping Pong Ball" class="landing-ball" />
        <img src="/bouncy.png" alt="bouncy effect" class="bouncy-effect" />
        <div class="landing-button-group">
          <button class="landing-button landing-dashboard-btn" id="landing-btn-dashboard">
            <a href="/dashboard" data-router-link>
              dashboard
            </a>
          </button>
          <button class="landing-button landing-play-btn" id="landing-btn-play">
            <a href="/play" data-router-link>
              🏓 play 🏓
            </a>
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("app").innerHTML = html;
  
  function setPageClass() {
    const path = window.location.pathname;
    // body의 모든 클래스를 제거
    document.body.className = '';
    
    // 현재 경로가 랜딩 페이지일 때만 클래스 추가
    if (path === "/") {
      document.body.classList.add("body-landing-only");
    }
    
    // 인라인 스타일 초기화
    document.body.style.cssText = "";
  }
  
  // 페이지 전환 감지
  window.addEventListener("popstate", setPageClass);
  
  // 링크 클릭 시 클래스 제거를 위한 이벤트 리스너
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-router-link]');
    if (link) {
      // 다른 페이지로 이동할 때 landing 클래스 제거
      if (link.getAttribute('href') !== '/') {
        document.body.classList.remove('body-landing-only');
      }
    }
  });
  
  // 페이지 최초 로드 시 초기화
  setPageClass();
}