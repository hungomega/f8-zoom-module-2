const playlistList = document.querySelector(".playlist-list");
const gridBtn = document.querySelector(".view-grid-btn");
const listBtn = document.querySelector(".view-list-btn");

gridBtn.addEventListener("click", function () {
    playlistList.classList.add("grid-mode");
});

listBtn.addEventListener("click", function () {
    playlistList.classList.remove("grid-mode");
});