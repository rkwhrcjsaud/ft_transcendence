import { GreetingBox } from './greetingBox.js';
import { ProfileAccordion } from './profileAccordion.js';
import { MatchHistoryAccordion } from './matchHistory.js';
// import { FriendsList } from './friendsList.js';

export function loadDashboard() {
    const app = document.getElementById('app');
    app.innerHTML = ''; // 기존 콘텐츠 초기화

    // GreetingBox 호출
    GreetingBox();
    ProfileAccordion();
    MatchHistoryAccordion();
}
