const navTabs = document.querySelectorAll(".nav-tab");
const libraryItems = document.querySelectorAll(".library-item");

navTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        const type = tab.textContent.trim().toLowerCase();

        // đổi active
        navTabs.forEach(function (tab) {
            tab.classList.remove("active");
        });

        tab.classList.add("active");

        // lọc
        libraryItems.forEach(function (item) {
            if (type === "playlists") {
                item.style.display =
                    item.dataset.type === "playlist" ? "flex" : "none";
            }

            if (type === "artists") {
                item.style.display =
                    item.dataset.type === "artist" ? "flex" : "none";
            }
        });
    });
});