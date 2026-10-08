import httpRequest from "../../utils/httpRequest.js";

let currentPlaylistId = null;

window.addEventListener("playlist-detail-rendered", function (event) {
    currentPlaylistId = event.detail.playlistId;

    const isFollowing = event.detail.isFollowing;

    console.log("Playlist cần follow:", currentPlaylistId);
    console.log("Đang follow:", isFollowing);

    const followBtn = document.querySelector(".follow-playlist-btn");
    if (!followBtn) return;
    followBtn.textContent = isFollowing ? "Unfollow" : "Follow";

    followBtn.onclick = async function () {
        try {
            if (followBtn.textContent.trim() === "Follow") {
                await httpRequest.post(`playlists/${currentPlaylistId}/follow`);

                followBtn.textContent = "Unfollow";
                console.log("Follow playlist thành công");
            } else {
                await httpRequest.delete(
                    `playlists/${currentPlaylistId}/follow`,
                );

                followBtn.textContent = "Follow";
                console.log("Unfollow playlist thành công");
            }
        } catch (error) {
            console.error("Follow/Unfollow playlist thất bại:", error);
            console.log("Server trả về:", error.response);
        }
    };
});

document.addEventListener("click", function () {
    menu.style.display = "none";
});