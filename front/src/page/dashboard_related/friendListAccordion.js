import { loadCSS } from "../../utils/loadcss";
import { language } from "../../utils/language";
import { getSecretValue } from "../../vault";
import { createAxiosInstance } from "../../utils/axiosInterceptor";
import Auth from "../../auth/authProvider";


export async function FriendListAccordion() {
  loadCSS("../../styles/friendListAccordion.css");
  const languageKey = localStorage.getItem("selectedLanguage");
  const axios = await createAxiosInstance();
  const apiUrl_friendList = await getSecretValue("front/FRONT_API_FRIENDS_LIST");
  console.log("API URL:", apiUrl_friendList);
  const res_friendList = await axios.get(apiUrl_friendList);
  console.log("Friend List:", res_friendList.data.users);
  const friends = res_friendList.data.users;

  const renderAccordion = () => {
    // 기존의 아코디언을 삭제
    const existingAccordion = document.getElementById("friendListAccordion");
    if (existingAccordion) {
      existingAccordion.remove();
    }

    const friendsListHTML = friends
      .filter((friend) => friend.isFriend)
      .map(
        (friend) => `
        <li class="friend-item">
          <img src="${friend.avatar}" alt="${friend.name}'s profile" class="friend-avatar" />
          <div class="friend-info">
            <span class="friend-name">${friend.name}</span>
            <span class="friend-status">
              <span class="status-display ${friend.status}"></span>
              ${friend.status}
            </span>
          </div>
          <button type="button" class="friend-remove-btn btn" data-bs-toggle="modal" data-bs-target="#deleteFriendModal" title="Delete friend">
            <i class="fa-solid fa-user-minus"></i>
          </button>
        </li>
      `
      )
      .join("");

    const html = `
      <div class="accordion" id="friendListAccordion">
        <div class="accordion-item">
            <h2 class="accordion-header" id="friendListHeader">
                <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#friendListContent"
                aria-expanded="true"
                aria-controls="friendListContent"
                >
                <span>${language[languageKey]["FriendList"]}</span>
                <span class="friend-count">${
                  friends.filter((friend) => friend.isFriend).length
                    }</span>
                <i class="fa-solid fa-chevron-down ms-2"></i>
                </button>
            </h2>
            <div
                id="friendListContent"
                class="accordion-collapse collapse show"
                aria-labelledby="friendListHeader"
                data-bs-parent="#friendListAccordion"
            >
                <div class="accordion-body">
                    <ul class="friend-list">
                        ${friendsListHTML}
                    </ul>

                    <div class="search-container">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input
                        type="text"
                        class="search-input"
                        placeholder=""
                        />
                        <button class="search-btn">${language[languageKey]["SearchFriend"]}</button>
                    </div>

                    <div class="search-results" style="display: none;">
                        <p class="no-results" style="display: none;">${language[languageKey]["SearchNone"]}</p>
                        <div class="search-results-list"></div>
                    </div>
                </div>
            </div>
            </div>
        </div>

        <!-- 친구 삭제 버튼 Modal -->
        <div class="modal fade" id="deleteFriendModal" tabindex="-1" aria-labelledby="deleteFriendModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="deleteFriendModalLabel">${language[languageKey]["DeleteCheckMessage"]}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${language[languageKey]["Undo"]}</button>
                <button type="button" class="btn btn-primary">${language[languageKey]["DeleteFriend"]}</button>
              </div>
            </div>
          </div>
        </div>
            `;

    const container = document.getElementById("app");
    if (container) {
      container.innerHTML += html;
    }
  };

  renderAccordion();

  const searchInput = document.querySelector(".search-input");
  searchInput.setAttribute("placeholder", language[languageKey]["SearchMessage"]);
  const searchButton = document.querySelector(".search-btn");
  const searchResultsContainer = document.querySelector(".search-results");
  const searchResultsList = document.querySelector(".search-results-list");
  const noResultsMessage = document.querySelector(".no-results");

  async function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
      searchResultsContainer.style.display = "none";
      return;
    }

    const filteredFriends = friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchTerm)
    );

    if (filteredFriends.length === 0) {
      noResultsMessage.style.display = "block";
      searchResultsList.style.display = "none";
    } else {
      noResultsMessage.style.display = "none";
      searchResultsList.style.display = "grid";
      searchResultsList.innerHTML = filteredFriends
        .map(
          (friend) => `
          <div class="search-result-card">
            <img src="${friend.avatar}" alt="${
            friend.name
          }'s profile" class="result-avatar" />
            <div class="result-info">
              <span class="result-name">${friend.name}</span>
              ${
                friend.isFriend
                  ? `<button type="button" class="friend-result-remove-btn btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteFriendModal"><i class="fa-solid fa-user-minus"></i>친구 삭제</button>`
                  : `<button class="friend-result-add-btn"><i class="fa-solid fa-user-plus"></i>${language[languageKey]["AddFriend"]}</button>`
              }
            </div>
          </div>
        `
        )
        .join("");
    }

    searchResultsContainer.style.display = "block";
  }

  searchButton.addEventListener("click", handleSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  document.addEventListener("click", (e) => {
    const addButton = e.target.closest(".friend-add-btn");
    const removeButton = e.target.closest(".friend-remove-btn");

    if (addButton || removeButton) {
      const friendName = e.target
        .closest(".search-result-card")
        .querySelector(".result-name").textContent;

      const friend = friends.find((f) => f.name === friendName);

      if (friend) {
        friend.isFriend = !friend.isFriend;
        renderAccordion(); // 전체 친구 리스트 리렌더링
      }
    }
  });

  const modalElement = document.getElementById("deleteFriendModal");
  modalElement.addEventListener("hidden.bs.modal", function () {
    // 현재 활성화된 요소를 블러 처리
    document.querySelector(".friend-remove-btn")?.blur();
  });
}
