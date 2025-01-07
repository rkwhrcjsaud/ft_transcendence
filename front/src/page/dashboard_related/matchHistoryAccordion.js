import { language } from "../../utils/language";
import { loadCSS } from "../../utils/loadcss";
import { createAxiosInstance } from "../../utils/axiosInterceptor";

export async function MatchHistoryAccordion() {
  loadCSS("../../styles/matchHistoryAccordion.css");
  const languageKey = localStorage.getItem("selectedLanguage");
  
  // Axios 인스턴스 생성
  const axiosInstance = await createAxiosInstance();
  
  try {
    // 현재 로그인한 사용자 정보 가져오기
    const userResponse = await axiosInstance.get('/accounts/myuser/');
    const userId = userResponse.data.id;
    const currentUserNickname = userResponse.data.nickname;

    // 매치 히스토리 데이터 가져오기
    const matchResponse = await axiosInstance.get(`/accounts/match_history/?user_id=${userId}`);
    const matchData = matchResponse.data;

    const userProfileResponse = await axiosInstance.get("/accounts/profile/");
    const profileData = userProfileResponse.data;

    // 통계 계산
    const stats = matchData.reduce((acc, match) => {
      if (match.result === 'win') acc.wins++;
      else if (match.result === 'loss') acc.losses++;
      else if (match.result === 'draw') acc.draws++;
      acc.total++;
      return acc;
    }, { total: 0, wins: 0, losses: 0, draws: 0 });

    // 최신 10경기만 가져오기
    const latest10Matches = matchData
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    // 매치 리스트 HTML 생성
    const matchListHTML = latest10Matches
      .map(match => {
        // 스코어가 정의되지 않았을 경우 기본값 설정
        const formattedScore = match.score || '0-0';
        const [player1Score, player2Score] = formattedScore.split('-').map(s => s.trim());
        
        // 날짜 포맷팅
        const matchDate = new Date(match.date);
        const formattedDate = `${matchDate.getFullYear()}. ${matchDate.getMonth() + 1}. ${matchDate.getDate()}.`;

        let userImage = "/default_profile.jpeg";
        const imageUrl = profileData.profile_image;
        if (!imageUrl)
          userImage = "/default_profile.jpeg";
        else if (imageUrl.startsWith('http://')) {
          // http://localhost 부분을 제거하고 상대 경로만 사용
          userImage = new URL(imageUrl).pathname;
        } else if (imageUrl.startsWith('https://')) {
          userImage = new URL(imageUrl).pathname;
        }
        
        return `
          <div class="match-item">
            <img src="${userImage}" alt="Profile" class="profile-img">
            <div class="match-info">
              <span class="matchlist-user">${currentUserNickname}</span>
              <div class="match-score">
                <span class="date-badge">${formattedDate}</span>
                <span class="score ${match.result}">${player1Score}-${player2Score}</span>
              </div>
              <span class="matchlist-user">${match.opponent || 'Guest'}</span>
            </div>
            <img src="/default_profile.jpeg" alt="Profile" class="profile-img">
          </div>
        `;
      })
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
              ${language[languageKey]["MatchHistory"]}
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
                <div class="card">
                  <div class="card-body">
                    <div class="stat-value">${stats.total}</div>
                    <div class="stat-label">${language[languageKey]["Total"]}</div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-body">
                    <div class="stat-value">${stats.wins}</div>
                    <div class="stat-label">${language[languageKey]["Victory"]}</div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-body">
                    <div class="stat-value">${stats.losses}</div>
                    <div class="stat-label">${language[languageKey]["Loss"]}</div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-body">
                    <div class="stat-value">${stats.draws}</div>
                    <div class="stat-label">${language[languageKey]["Draw"]}</div>
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
    
  } catch (error) {
    console.error('Error fetching match history:', error);
    // 에러 처리 - 사용자에게 에러 메시지 표시
    document.getElementById("app").innerHTML += `
      <div class="alert alert-danger">
        ${language[languageKey]["ErrorLoadingMatchHistory"]}
      </div>
    `;
  }
}