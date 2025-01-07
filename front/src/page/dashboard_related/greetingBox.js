import { loadCSS } from "../../utils/loadcss";
import { language } from "../../utils/language";
import { createAxiosInstance } from "../../utils/axiosInterceptor";

export async function GreetingBox() {
  loadCSS("../../styles/greetingBox.css");
  const languageKey = localStorage.getItem("selectedLanguage");

  // Axios 인스턴스 생성
  const axios = await createAxiosInstance();
    
  // 유저 정보 가져오기
  let userNickname = "";
  try {
    const response = await axios.get("/accounts/profile/");
    userNickname = response.data.nickname || "User";
  } catch (error) {
    console.error("Failed to load profile data:", error);
    userNickname = "User"; // 기본값 설정
  }

  // 시간대에 따라 `hours` 메시지를 반환하는 함수
  const getHoursMessage = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 11) {
      return language[languageKey]["GreetingMorning"];
    } else if (currentHour >= 11 && currentHour < 18) {
      return language[languageKey]["GreetingAfternoon"];
    } else {
      return language[languageKey]["GreetingEvening"];
    }
  };

  // 시간대에 따라 `prefix` 메시지를 반환하는 함수
  const getGreetingMessage = () => {
    const postfix = language[languageKey]["Postfix"];
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 11) {
      return language[languageKey]["Morning"]+`, ${postfix}`;
    } else if (currentHour >= 11 && currentHour < 14) {
      return language[languageKey]["Launch"]+ `, ${postfix}`;
    } else if (currentHour >= 14 && currentHour < 18) {
      return language[languageKey]["Afternoon"] + `, ${postfix}`;
    } else if (currentHour >= 18 && currentHour < 21) {
      return language[languageKey]["Dinner"] + `, ${postfix}`;
    } else {
      return language[languageKey]["Bored"] + `${postfix}`;
    }
  };

  // Greeting Box HTML 구조
  const greetingBoxHTML = `
    <div class="greeting-box">
      <div class="greeting-subbox">
        <h4 class="greeting-user">
          <strong> ${language[languageKey]["Hello"]} </strong>
          <strong> ${userNickname}</strong>
          <strong id="Term"> </strong>
          <strong> ${getHoursMessage()}</strong>
        </h4>
        <div class="greeting-row">
          <p class="greeting-message">${getGreetingMessage()}</p>
          <button class="greeting-button">
            <a href="/play" data-router-link>
              ${language[languageKey]["Playing"]}
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
  
    if (languageKey == "한국어")
      document.getElementById("Term").innerText = "님!";
    else
      document.getElementById("Term").innerText = "!";
  
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
