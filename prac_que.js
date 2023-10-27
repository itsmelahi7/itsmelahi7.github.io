function loadEventListners() {
    setEventListners();
    updateTags();
    filter();

    var menu_button = qs("#openMenu");
    menu_button.addEventListener("click", function () {
        qs("#tabOverlay").style.right = "0";
        show("#tabOverlay");
    });

    document.querySelector("#closeMenu").addEventListener("click", function () {
        closeTabOverlay();
    });
}

setTimeout(function () {
    loadEventListners();
}, 1000);
