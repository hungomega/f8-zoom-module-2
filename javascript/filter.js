const filterBtns = document.querySelectorAll(".filter-btn");
const hitsSection = document.querySelector(".hits-section");
const artistsSection = document.querySelector(".artists-section");

filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
        const filter = btn.dataset.filter;

        if (filter === "all") {
            hitsSection.style.display = "block";
            artistsSection.style.display = "block";
        }

        if (filter === "playlists") {
            hitsSection.style.display = "block";
            artistsSection.style.display = "none";
        }

        if (filter === "artists") {
            hitsSection.style.display = "none";
            artistsSection.style.display = "block";
        }
    });
});