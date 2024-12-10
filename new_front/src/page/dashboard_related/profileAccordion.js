import { loadCSS } from '../../utils/loadcss';

export function ProfileAccordion() {
    loadCSS('../../styles/profileAccordion.css');

    const profileAccordionHTML = `
      <div class="accordion" id="dashProfile">
        <div class="accordion-item">
          <h2 class="accordion-header" id="profileHeader">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#profileContent" aria-expanded="true" aria-controls="profileContent">
              프로필
              <i class="accordion-icon fas fa-chevron-down"></i>
            </button>
          </h2>
          <div id="profileContent" class="accordion-collapse collapse show" aria-labelledby="profileHeader" data-bs-parent="#dashProfile">
            <div class="accordion-body">
              <div class="profile-container">
                <div class="profile-image">
                  <img src="../../../public/default_profile.jpeg" alt="Profile" />
                </div>
                <h2 class="profile-name">ranchoi</h2>
                <div class="profile-buttons">
                  <!-- 프로필 수정 버튼 -->
                  <button class="profile-button profile-setting-btn">
                    <i class="profile-btn-icon fas fa-cog"></i> 프로필 수정
                  </button>
                  <!-- 비밀번호 변경 버튼 -->
                  <button class="profile-button">
                    <i class="profile-btn-icon fas fa-lock"></i> 비밀번호 변경
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  
    // #app에 추가하기
    const container = document.querySelector('#app');
    if (container) {
      container.innerHTML += profileAccordionHTML;
    }
  
    // 이벤트 추가 (프로필 수정 및 비밀번호 변경 버튼)
    document.querySelector('.profile-setting-btn').addEventListener('click', () => {
      // 여기서 페이지 이동 또는 다른 로직 처리 가능!!!(임시)
      window.location.href = '/dashboard/edit_profile';
    });

    // 아코디언 화살표 회전 애니메이션
    const accordionButton = container.querySelector('.accordion-button');
    accordionButton.addEventListener('click', (e) => {
      const icon = e.currentTarget.querySelector('.accordion-icon');
      if (icon) {
        icon.classList.toggle('rotated');
      }
    });
  }
  