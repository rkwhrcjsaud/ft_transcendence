import { GreetingBox } from "./greetingBox.js";
import { ProfileAccordion } from "./profileAccordion.js";
import { MatchHistoryAccordion } from "./matchHistoryAccordion.js";
import { FriendListAccordion } from "./friendListAccordion.js";

export function loadDashboard() {
  const app = document.getElementById("app");
  app.innerHTML = ""; // 기존 콘텐츠 초기화

  GreetingBox();
  ProfileAccordion();
  MatchHistoryAccordion();
  FriendListAccordion();
}
