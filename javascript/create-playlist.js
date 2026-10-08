import httpRequest from "../../utils/httpRequest.js";

const createBtn = document.querySelector(".create-btn");
const imageInput = document.querySelector("#playlist-image");
const uploadImageBtn = document.querySelector(".upload-image-btn");
let playlist = null;
let playlistId = null;

createBtn.addEventListener("click", async function () {
    try {
        const response = await httpRequest.post("playlists", {
            name: "My Public Playlist",
            is_public: 1,
        });
        playlist = response.playlist;
        playlistId = playlist.id;

        console.log("PLAYLIST VỪA TẠO:", playlist);
        console.log("PUBLIC:", playlist.is_public);

        console.log(playlistId);

        console.log("Playlist:", playlist);
        console.log("Playlist ID:", playlistId);
    } catch (error) {
        console.error(error);
    }
});

imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];
    if (!file) {
        return;
    }
    console.log("Đã chọn:", file);
});

uploadImageBtn.addEventListener("click", async function () {
    const file = imageInput.files[0];

    if (!file) {
        console.log("Chưa chọn ảnh");
        return;
    }

    if (!playlistId) {
        console.log("Chưa có playlist");
        return;
    }

    const formData = new FormData();

    formData.append("cover", file);

    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(
            `https://spotify.f8team.dev/api/upload/playlist/${playlistId}/cover`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            },
        );

        const data = await response.json();

        console.log("Image URL:", data.file.url);

        const updateResponse = await httpRequest.put(
            `playlists/${playlistId}`,
            {
                name: playlist.name,
                description: playlist.description,
                is_public: playlist.is_public,
                image_url: data.file.url,
            },
        );

        console.log("Playlist updated:", updateResponse);

        const playlistResponse = await httpRequest.get(
            `playlists/${playlistId}`,
        );

        console.log("Playlist sau khi upload:", playlistResponse);
    } catch (error) {
        console.error(error);
    }
});

async function getMyPlaylists() {
    try {
        const response = await httpRequest.get("me/playlists");

        renderPlaylists(response.playlists);
    } catch (error) {
        console.error(error);
    }
}

getMyPlaylists();

function renderPlaylists(playlists) {
    const playlistList = document.querySelector(".playlist-list");

    playlistList.innerHTML = "";

    playlists.forEach((playlist) => {
        const item = document.createElement("div");

        item.classList.add("playlist-item");

        // Thêm ID playlist vào element
        item.dataset.playlistId = playlist.id;

        const img = document.createElement("img");

        img.src = playlist.image_url || "./placeholder.svg";
        img.alt = playlist.name;

        const name = document.createElement("div");
        name.classList.add("playlist-name");
        name.textContent = playlist.name;

        item.appendChild(img);
        item.appendChild(name);

        item.addEventListener("click", function () {
            window.dispatchEvent(
                new CustomEvent("playlist-click", {
                    detail: {
                        playlistId: playlist.id,
                    },
                }),
            );
        });

        playlistList.appendChild(item);
    });
}

window.addEventListener("playlist-updated", function () {
    getMyPlaylists();
});
