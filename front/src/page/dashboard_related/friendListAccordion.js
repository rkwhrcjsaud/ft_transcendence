// SPA 스타일로 동작하도록 FriendListAccordion 모듈 수정
import { loadCSS } from "../../utils/loadcss";
import { language } from "../../utils/language";
import { getSecretValue } from "../../vault";
import { createAxiosInstance } from "../../utils/axiosInterceptor";

let selectedFriendId = null;
let friends = [];
let languageKey = localStorage.getItem("selectedLanguage");

export async function FriendListAccordion() {
  loadCSS("../../styles/friendListAccordion.css");
  const axios = await createAxiosInstance();
  const apiUrl_friendList = await getSecretValue("front/FRONT_API_FRIENDS_LIST");

  async function fetchFriendList() {
    const response = await axios.get(apiUrl_friendList);
    friends = response.data.users;
  }

  function renderFriendList() {
    const friendList = friends.filter(friend => friend.isFriend);
    const friendListContainer = document.querySelector(".friend-list");
    friendListContainer.innerHTML = friendList
      .map(friend => `
        <li class="friend-item">
          <img src="${friend.avatar}" alt="${friend.name}'s profile" class="friend-avatar" />
          <div class="friend-info">
            <span class="friend-name">${friend.name}</span>
            <span class="friend-status">
              <span class="status-display ${friend.status}"></span>
              ${friend.status}
            </span>
          </div>
          <button type="button" class="friend-remove-btn btn" data-bs-toggle="modal" data-bs-target="#deleteFriendModal" data-id="${friend.id}" title="Delete friend">
            <i class="fa-solid fa-user-minus"></i>
          </button>
        </li>
      `).join("");

    document.querySelector(".friend-count").textContent = friendList.length;
  }

  function renderSearchResults(results) {
    const searchResultsContainer = document.querySelector(".search-results");
    const searchResultsList = document.querySelector(".search-results-list");
    const noResultsMessage = document.querySelector(".no-results");

    if (results.length === 0) {
      noResultsMessage.style.display = "block";
      searchResultsList.style.display = "none";
    } else {
      noResultsMessage.style.display = "none";
      searchResultsList.style.display = "grid";
      searchResultsList.innerHTML = results.map(friend => `
        <div class="search-result-card" data-id="${friend.id}">
          <img src="${friend.avatar}" alt="${friend.name}'s profile" class="result-avatar" />
          <div class="result-info">
            <span class="result-name">${friend.name}</span>
            ${friend.isFriend ? 
              `<button type="button" class="friend-result-remove-btn btn btn-primary" data-bs-toggle="modal" data-id="${friend.id}" data-bs-target="#deleteFriendModal">
                <i class="fa-solid fa-user-minus"></i>${language[languageKey]["DeleteFriend"]}
              </button>` : 
              `<button class="friend-result-add-btn"><i class="fa-solid fa-user-plus"></i>${language[languageKey]["AddFriend"]}</button>`
            }
          </div>
        </div>
      `).join("");
    }

    searchResultsContainer.style.display = "block";
  }

  async function handleSearch() {
    const searchInput = document.querySelector(".search-input");
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
      document.querySelector(".search-results").style.display = "none";
      return;
    }

    const results = friends.filter(friend => friend.name.toLowerCase().includes(searchTerm));
    renderSearchResults(results);
  }

  async function handleAddFriend(friendId) {
    const apiUrl_addFriend = await getSecretValue("front/FRONT_API_FRIENDS_ADD");
    await axios.post(apiUrl_addFriend, { friend_id: friendId });
    await fetchFriendList();
    renderFriendList();
  }

  async function handleRemoveFriend() {
    if (selectedFriendId) {
      const apiUrl_removeFriend = await getSecretValue("front/FRONT_API_FRIENDS_REMOVE");
      await axios.post(apiUrl_removeFriend, { friend_id: selectedFriendId });
      selectedFriendId = null;
      await fetchFriendList();
      renderFriendList();
    }
  }

  async function attachEventListeners() {
    document.querySelector(".search-btn").addEventListener("click", handleSearch);
    document.querySelector(".search-input").addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSearch();
    });

    document.querySelector(".friend-list").addEventListener("click", (e) => {
      const removeButton = e.target.closest(".friend-remove-btn");
      if (removeButton) {
        selectedFriendId = removeButton.getAttribute("data-id");
      }
    });

    document.querySelector(".search-results-list").addEventListener("click", (e) => {
      const addButton = e.target.closest(".friend-result-add-btn");
      const removeButton = e.target.closest(".friend-result-remove-btn");

      if (addButton) {
        const friendId = addButton.closest(".search-result-card").getAttribute("data-id");
        handleAddFriend(friendId);
      }

      if (removeButton) {
        selectedFriendId = removeButton.getAttribute("data-id");
      }
    });

    document.getElementById("confirmDeleteFriend").addEventListener("click", handleRemoveFriend);
  }

  async function renderAccordion() {
    await fetchFriendList();

    const container = document.getElementById("app");
    // 기존에 있던 friendListAccordion이 있다면 삭제
    const existingAccordion = document.getElementById("friendListAccordion");
    if (existingAccordion) {
      existingAccordion.remove();
    }
    container.innerHTML += `
      <div class="accordion" id="friendListAccordion">
        <div class="accordion-item">
          <h2 class="accordion-header" id="friendListHeader">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#friendListContent" aria-expanded="true" aria-controls="friendListContent">
              <span>${language[languageKey]["FriendList"]}</span>
              <span class="friend-count">0</span>
              <i class="fa-solid fa-chevron-down ms-2"></i>
            </button>
          </h2>
          <div id="friendListContent" class="accordion-collapse collapse show" aria-labelledby="friendListHeader" data-bs-parent="#friendListAccordion">
            <div class="accordion-body">
              <ul class="friend-list"></ul>

              <div class="search-container">
                <i class="fa-solid fa-magnifying-glass search-icon"></i>
                <input type="text" class="search-input" placeholder="${language[languageKey]["SearchMessage"]}" />
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
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>${language[languageKey]["DeleteCheckMessage"]}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${language[languageKey]["Undo"]}</button>
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="confirmDeleteFriend">${language[languageKey]["DeleteFriend"]}</button>
            </div>
          </div>
        </div>
      </div>
    `;

    renderFriendList();
    attachEventListeners();
  }

  await renderAccordion();
}
