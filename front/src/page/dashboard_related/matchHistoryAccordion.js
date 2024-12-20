import { loadCSS } from "../../utils/loadcss";

export function MatchHistoryAccordion() {
  loadCSS("../../styles/matchHistoryAccordion.css");

  // 목데이터: 매치 통계
  const stats = {
    total: 7,
    wins: 4,
    losses: 2,
    draws: 1,
  };

  // 목데이터: 매치 히스토리
  const matchData = [
    {
      date: "12월 24일",
      score: "2 : 1",
      player1: {
        name: "testUser1",
        profileImg: "../../../public/default_profile.jpeg",
      },
      player2: {
        name: "testUser2",
        profileImg: "../../../public/default_profile.jpeg",
      },
    },
    {
      date: "12월 20일",
      score: "1 : 2",
      player1: {
        name: "testUser1",
        profileImg: "../../../public/default_profile.jpeg",
      },
      player2: {
        name: "testUser2",
        profileImg: "../../../public/default_profile.jpeg",
      },
    },
  ];

  // 최신 10경기만 가져오기
  const latest10Matches = matchData
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // 최신 날짜순 정렬
    .slice(0, 10); // 최신 10경기만 자르기!!

  // 매치 리스트 HTML 생성
  const matchListHTML = latest10Matches
    .map(
      (match) => `
      <div class="match-item">
        <img src="${match.player1.profileImg}" alt="Profile" class="profile-img">
        <div class="match-info">
          <span class="matchlist-user">${match.player1.name}</span>
          <div class="match-score">
            <span class="date-badge">${match.date}</span>
            <span class="score">${match.score}</span>
          </div>
          <span class="matchlist-user">${match.player2.name}</span>
        </div>
        <img src="${match.player2.profileImg}" alt="Profile" class="profile-img">
      </div>
    `
    )
    .join("");

  const html = `
    <div class="accordion" id="matchHistoryAccordion">
      <div class="accordion-item">
        <h2 class="accordion-header" id="matchHistoryHeader">
            <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#matchHistoryContent"
                aria-expanded="true"
                aria-controls="matchHistoryContent"
            >
            매치 히스토리
            <i class="fa-solid fa-chevron-down ms-2"></i>
          </button>
        </h2>
        <div
          id="matchHistoryContent"
          class="accordion-collapse collapse show"
          aria-labelledby="matchHistoryHeader"
          data-bs-parent="#matchHistoryAccordion"
        >
          <div class="accordion-body">
            <!-- 통계 -->
            <div class="match-stats">
              <!-- TOTAL 카드 -->
              <div class="card">
                <div class="card-body">
                  <div class="stat-value">${stats.total}</div>
                  <div class="stat-label">TOTAL</div>
                </div>
              </div>
              <!-- 이긴 횟수 카드 -->
              <div class="card">
                <div class="card-body">
                  <div class="stat-value">${stats.wins}</div>
                  <div class="stat-label">이긴 횟수</div>
                </div>
              </div>
              <!-- 진 횟수 카드 -->
              <div class="card">
                <div class="card-body">
                  <div class="stat-value">${stats.losses}</div>
                  <div class="stat-label">진 횟수</div>
                </div>
              </div>
              <!-- 비긴 횟수 카드 -->
              <div class="card">
                <div class="card-body">
                  <div class="stat-value">${stats.draws}</div>
                  <div class="stat-label">비긴 횟수</div>
                </div>
              </div>
            </div>

            <!-- 매치 리스트 -->
            <div class="match-list">
              ${matchListHTML}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("app").innerHTML += html;
}
