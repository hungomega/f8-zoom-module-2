import httpRequest from "../../utils/httpRequest.js";

let currentArtistId = null;
const artistList = document.querySelector(".artists-grid");

const menu = document.createElement("div");

menu.classList.add("context-menu");

menu.innerHTML = `
    <div class="context-menu-item unfollow-artist">
        Unfollow
    </div>
`;

document.body.appendChild(menu);

const unfollowBtn = menu.querySelector(".unfollow-artist");

window.addEventListener("artist-detail-rendered", function (event) {
    currentArtistId = event.detail.artistId;

    const isFollowing = event.detail.isFollowing;

    const followButton = document.querySelector(".artist-follow-btn");

    if (!followButton) return;

    followButton.textContent = isFollowing ? "Unfollow" : "Follow";

    followButton.onclick = async function () {
        try {
            if (followButton.textContent === "Follow") {
                await httpRequest.post(`artists/${currentArtistId}/follow`);

                followButton.textContent = "Unfollow";
                console.log("Follow artist thành công");
            } else {
                await httpRequest.delete(`artists/${currentArtistId}/follow`);

                followButton.textContent = "Follow";
                console.log("Unfollow artist thành công");
            }
        } catch (error) {
            console.error("Follow/Unfollow artist thất bại:", error);
        }
    };
});

artistList.addEventListener("contextmenu", async function (event) {
    event.preventDefault();

    const artistItem = event.target.closest(".artist-card");
    if (!artistItem) {
        return;
    }

    currentArtistId = artistItem.dataset.artistId;

    console.log("Artist ID:", currentArtistId);

    const response = await httpRequest.get(`artists/${currentArtistId}`);

    console.log("Artist detail:", response);
    console.log("is_following:", response.is_following);

    if (!response.is_following) {
        return;
    }

    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
    menu.style.display = "block";
});
unfollowBtn.addEventListener("click", async function () {
    try {
        await httpRequest.delete(
            `artists/${currentArtistId}/follow`,
        );

        console.log("Unfollow artist thành công");

        menu.style.display = "none";
    } catch (error) {
        console.error("Unfollow artist thất bại:", error);
        console.log("Server trả về:", error.response);
    }
});

document.addEventListener("click", function () {
    menu.style.display = "none";
});