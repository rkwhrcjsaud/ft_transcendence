import { loadCSS } from "../../utils/loadcss";


export function GreetingBox() {
  loadCSS("../../styles/greetingBox.css");
  // 시간대에 따라 `hours` 메시지를 반환하는 함수
  const getHoursMessage = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 11) {
      return "좋은 아침이예요 🌞";
    } else if (currentHour >= 11 && currentHour < 18) {
      return "좋은 오후예요 🍀";
    } else {
      return "좋은 저녁이예요 🌝";
    }
  };

  // 시간대에 따라 `prefix` 메시지를 반환하는 함수
  const getGreetingMessage = () => {
    const postfix = "🏓 핑퐁🏓  한 판 어떠세요?";
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 11) {
      return `하루의 시작, ${postfix}`;
    } else if (currentHour >= 11 && currentHour < 14) {
      return `식후 ${postfix}`;
    } else if (currentHour >= 14 && currentHour < 18) {
      return `나른한 오후, ${postfix}`;
    } else if (currentHour >= 18 && currentHour < 21) {
      return `식후 ${postfix}`;
    } else {
      return `심심할 때 ${postfix}`;
    }
  };

  // Greeting Box HTML 구조
  const greetingBoxHTML = `
      <div class="greeting-box">
        <div class="greeting-subbox">
          <h4 class="greeting-user">
            <strong>ranchoi 님! ${getHoursMessage()}</strong>
          </h4>
          <div class="greeting-row">
            <p class="greeting-message">${getGreetingMessage()}</p>
            <button class="greeting-button">
               <a href="/play" data-router-link>
                게임하러 가기
              </a>
            </button>
          </div>
        </div>
      </div>
    `;

  // 기본 컨테이너(`#app`)에 Greeting Box 추가
  const container = document.querySelector("#app");
  if (container) {
    container.innerHTML += greetingBoxHTML;

    // "게임하러 가기" 버튼 클릭 이벤트
    const button = container.querySelector(".greeting-button");
    button.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState({}, "", "/play"); // URL 경로 변경
      loadPage("/play"); // play 페이지 로드
    });
  } else {
    console.error("Container with ID '#app' not found.");
  }
}
