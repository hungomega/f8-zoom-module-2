import httpRequest from "../../utils/httpRequest.js";

const playlistList = document.querySelector(".playlist-list");

let currentPlaylistId = null;

const menu = document.createElement("div");

menu.classList.add("context-menu");

menu.innerHTML = `
    <div class="context-menu-item delete-playlist">
        Delete Playlist
    </div>

     <div class="context-menu-item unfollow-playlist">
        Unfollow Playlist
    </div>
`;

document.body.appendChild(menu);

playlistList.addEventListener("contextmenu", async function (event) {
    event.preventDefault();

    const playlistItem = event.target.closest(".playlist-item");

    if (!playlistItem) {
        return;
    }

    currentPlaylistId = playlistItem.dataset.playlistId;

    console.log("Playlist ID:", currentPlaylistId);

    // Lấy thông tin playlist
    const response = await httpRequest.get(`playlists/${currentPlaylistId}`);

    console.log("Playlist detail:", response);
    console.log("is_following:", response.is_following);

    deleteBtn.style.display = response.is_owner ? "block" : "none";

    unfollowBtn.style.display =
        !response.is_owner && response.is_following ? "block" : "none";

    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
    menu.style.display = "block";
});

const deleteBtn = menu.querySelector(".delete-playlist");
const unfollowBtn = menu.querySelector(".unfollow-playlist");

deleteBtn.addEventListener("click", async function () {
    try {
        await httpRequest.delete(`playlists/${currentPlaylistId}`);

        console.log("Delete playlist thành công");

        menu.style.display = "none";

        const playlistItem = document.querySelector(
            `[data-playlist-id="${currentPlaylistId}"]`,
        );

        if (playlistItem) {
            playlistItem.remove();
        }
    } catch (error) {
        console.error("Delete playlist thất bại:", error);
        console.log("Server trả về:", error.response);
    }
});

unfollowBtn.addEventListener("click", async function () {
    try {
        await httpRequest.delete(`playlists/${currentPlaylistId}/follow`);

        console.log("Unfollow playlist thành công");

        menu.style.display = "none";

        const playlistItem = document.querySelector(
            `[data-playlist-id="${currentPlaylistId}"]`,
        );

        if (playlistItem) {
            playlistItem.remove();
        }
    } catch (error) {
        console.error("Unfollow playlist thất bại:", error);
        console.log("Server trả về:", error.response);
    }
});
document.addEventListener("click", function () {
    menu.style.display = "none";
});