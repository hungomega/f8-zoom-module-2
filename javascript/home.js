import httpRequest from "../utils/httpRequest.js";

async function getPlayList() {
    try {
        const response = await httpRequest.get("playlists");
        const playlists = response.playlists;
        const hitsGrid = document.querySelector(".hits-grid");

        playlists.forEach((playlist) => {
            const card = document.createElement("div");
            card.classList.add("hit-card");

            const cardCover = document.createElement("div");
            cardCover.classList.add("hit-card-cover");

            const img = document.createElement("img");
            img.src = playlist.image_url || "placeholder.svg";
            img.alt = playlist.name;
            img.onerror = function () {
                img.src = "./placeholder.svg";
            };

            cardCover.appendChild(img);
            card.appendChild(cardCover);

            // thông tin playlist
            const cardInfo = document.createElement("div");
            cardInfo.classList.add("hit-card-info");
            const title = document.createElement("h3");
            title.textContent = playlist.name;

            const creator = document.createElement("p");
            creator.textContent = playlist.user_display_name;
            cardInfo.appendChild(title);
            cardInfo.appendChild(creator);
            card.appendChild(cardInfo);
            hitsGrid.appendChild(card);

            card.addEventListener("click", async function () {
                const hitsSection = document.querySelector(".hits-section");
                const artistsSection =
                    document.querySelector(".artists-section");
                const detailSection = document.querySelector(".detail-section");
                // Handle playlist detail view
                try {
                    const response = await httpRequest.get(
                        `playlists/${playlist.id}`,
                    );
                    const playlistDetail = response;

                    console.log(playlistDetail);

                    hitsSection.classList.add("hidden");
                    artistsSection.classList.add("hidden");
                    detailSection.classList.remove("hidden");

                    detailSection.innerHTML = "";
                    const img = document.createElement("img");

                    img.src = playlistDetail.image_url || "./placeholder.svg";
                    img.alt = playlistDetail.name;

                    img.onerror = function () {
                        img.src = "./placeholder.svg";
                    };

                    detailSection.appendChild(img);

                    const title = document.createElement("h1");
                    title.textContent = playlistDetail.name;
                    detailSection.appendChild(title);

                    const description = document.createElement("p");
                    description.textContent = playlistDetail.description || "";
                    detailSection.appendChild(description);

                    const saveButton = document.createElement("button");

                    saveButton.textContent = playlistDetail.is_following
                        ? "Unsave"
                        : "Save";
                    saveButton.addEventListener("click", async function () {
                        try {
                            if (playlistDetail.is_following) {
                                await httpRequest.delete(
                                    `playlists/${playlistDetail.id}/follow`,
                                );

                                playlistDetail.is_following = false;
                                saveButton.textContent = "Save";
                            } else {
                                await httpRequest.post(
                                    `playlists/${playlistDetail.id}/follow`,
                                );

                                playlistDetail.is_following = true;
                                saveButton.textContent = "Unsave";
                            }
                        } catch (error) {
                            console.error(
                                "Error saving/unsaving playlist:",
                                error,
                            );
                        }
                    });
                    detailSection.appendChild(saveButton);
                } catch (error) {
                    console.error("Error fetching playlist detail:", error);
                }
            });
        });
    } catch (error) {
        console.error("Error fetching playlists:", error);
        throw error;
    }
}

async function getArtist() {
    try {
        const response = await httpRequest.get("artists");
        const artists = response.artists;
        const artistsGrid = document.querySelector(".artists-grid");

        artists.forEach((artist) => {
            const card = document.createElement("div");
            card.classList.add("artist-card");
            card.dataset.artistId = artist.id;

            artistsGrid.appendChild(card);

            const img = document.createElement("img");
            img.src = artist.image_url || "placeholder.svg";
            img.alt = artist.name;
            img.onerror = function () {
                img.src = "./placeholder.svg";
            };
            card.appendChild(img);

            const name = document.createElement("h3");
            name.textContent = artist.name;
            card.appendChild(name);

            card.addEventListener("click", async function () {
                const hitsSection = document.querySelector(".hits-section");
                const artistsSection =
                    document.querySelector(".artists-section");
                const detailSection = document.querySelector(".detail-section");

                try {
                    const response = await httpRequest.get(
                        `artists/${artist.id}`,
                    );

                    const artistDetail = response;

                    hitsSection.classList.add("hidden");
                    artistsSection.classList.add("hidden");
                    detailSection.classList.remove("hidden");

                    detailSection.innerHTML = "";

                    // Ảnh
                    const img = document.createElement("img");

                    img.src = artistDetail.image_url || "./placeholder.svg";
                    img.alt = artistDetail.name;

                    img.onerror = function () {
                        img.src = "./placeholder.svg";
                    };

                    detailSection.appendChild(img);

                    // Tên
                    const title = document.createElement("h1");
                    title.textContent = artistDetail.name;

                    detailSection.appendChild(title);

                    // Bio
                    const bio = document.createElement("p");
                    bio.textContent = artistDetail.bio || "";

                    detailSection.appendChild(bio);

                    console.log(artistDetail);

                    const followButton = document.createElement("button");

                    followButton.classList.add("artist-follow-btn");

                    followButton.textContent = artistDetail.is_following
                        ? "Unfollow"
                        : "Follow";

                    // QUAN TRỌNG
                    detailSection.appendChild(followButton);

                    window.dispatchEvent(
                        new CustomEvent("artist-detail-rendered", {
                            detail: {
                                artistId: artistDetail.id,
                                isFollowing: artistDetail.is_following,
                            },
                        }),
                    );
                } catch (error) {
                    console.error("Error fetching artist detail:", error);
                }
            });
        });
    } catch (error) {
        console.error("Error fetching artists:", error);
        throw error;
    }
}

function showHome() {
    const hitsSection = document.querySelector(".hits-section");
    const artistsSection = document.querySelector(".artists-section");
    const detailSection = document.querySelector(".detail-section");

    hitsSection.classList.remove("hidden");
    artistsSection.classList.remove("hidden");
    detailSection.classList.add("hidden");
}

const homeBtn = document.querySelector(".home-btn");
homeBtn.addEventListener("click", showHome);

const logo = document.querySelector(".logo");
logo.addEventListener("click", showHome);

getPlayList();
getArtist();

const fileInput = document.createElement("input");

fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.style.display = "none";
let currentPlaylistId = null;
window.addEventListener("playlist-click", async function (event) {
    const playlistId = event.detail.playlistId;
    currentPlaylistId = playlistId;

    console.log("Nhận playlist ID:", playlistId);

    const response = await httpRequest.get(`playlists/${playlistId}`);

    console.log("Playlist detail:", response);
    console.log("is_following:", response.is_following);
    const detailSection = document.querySelector(".detail-section");

    detailSection.classList.remove("hidden");

    detailSection.innerHTML = `
    <img 
        class="playlist-detail-image"
        src="${response.image_url || "./placeholder.svg"}"
        alt="${response.name}"
    >

    <h1>${response.name}</h1>

    <p>${response.description || ""}</p>

   ${
       response.is_public
           ? `<button class="follow-playlist-btn">
            ${response.is_following ? "Unfollow" : "Follow"}
           </button>`
           : ""
   }
`;
    window.dispatchEvent(
        new CustomEvent("playlist-detail-rendered", {
            detail: {
                playlistId: playlistId,
                isFollowing: response.is_following,
            },
        }),
    );
    const playlistImage = detailSection.querySelector(".playlist-detail-image");

    playlistImage.addEventListener("click", function () {
        fileInput.click();
    });
});

document.body.appendChild(fileInput);

fileInput.addEventListener("change", async function () {
    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    console.log("Ảnh đã chọn:", file);

    const formData = new FormData();

    formData.append("cover", file);

    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(
        `https://spotify.f8team.dev/api/upload/playlist/${currentPlaylistId}/cover`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        },
    );

    const data = await response.json();

    console.log("Upload response:", data);
    const imageUrl = data.file.url;

    console.log("Ảnh mới:", imageUrl);
    const updateResponse = await httpRequest.put(
        `playlists/${currentPlaylistId}`,
        {
            image_url: imageUrl,
        },
    );

    console.log("Playlist updated:", updateResponse);
    const playlistImage = document.querySelector(".playlist-detail-image");

    playlistImage.src = `https://spotify.f8team.dev${imageUrl}`;
    window.dispatchEvent(new Event("playlist-updated"));
});

window.testFollowPlaylist = async function () {
    const response = await httpRequest.post(
        "playlists/c3c6f9cb-0de5-4561-8317-56d98931abe9/follow",
    );

    console.log(response);
    return response;
};
