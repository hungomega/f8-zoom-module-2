document.addEventListener("contextmenu", function (event) {
    if (
        event.target.closest(".playlist-item") ||
        event.target.closest(".artist-card")
    ) {
        return;
    }

    event.preventDefault();
});