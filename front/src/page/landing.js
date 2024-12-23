import { loadCSS } from "../utils/loadcss";

export function loadLanding() {
  loadCSS("../styles/landing.css");

  const html = `
    <div class="landing-page">
      <div class="ball-container">
        <img src="../../public/ball.png" alt="Ping Pong Ball" class="landing-ball" />
        <img src="../../public/bouncy.png" alt="bouncy effect" class="bouncy-effect" />
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

  // 탁구공 사진 패럴랙스 효과 추가
  const landingBall = document.querySelector(".landing-ball");
  const ballContainer = document.querySelector(".ball-container");

  ballContainer.addEventListener("mousemove", (event) => {
    const rect = ballContainer.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 40;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 40;

    landingBall.style.transform = `translate(${x}px, ${y}px)`;
  });

  ballContainer.addEventListener("mouseleave", () => {
    landingBall.style.transform = "translate(0, 0)";
  });
}
