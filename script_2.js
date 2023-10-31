document.addEventListener("DOMContentLoaded", function () {
    getData();
    debugger;
    const searchInput = document.querySelector(".search-card");
    const autocompleteOverlay = document.querySelector(".autocomplete-overlay");
    const autocompleteList = document.getElementById("autocomplete-list");

    searchInput.addEventListener("input", function () {
        debugger;
        const searchValue = searchInput.value.toLowerCase();
        const matchingCards = qq.cards.filter((card) => {
            return card.heading.toLowerCase().includes(searchValue) || card.content.toLowerCase().includes(searchValue);
        });

        // Clear previous autocomplete suggestions
        autocompleteList.innerHTML = "";

        if (searchValue) {
            // Create and display autocomplete suggestions
            autocompleteOverlay.style.display = "block";

            // Add the searched text at the top
            const searchTextItem = document.createElement("li");
            searchTextItem.textContent = searchValue;
            autocompleteList.appendChild(searchTextItem);

            // Add matching card headings
            matchingCards.forEach((card) => {
                const headingItem = document.createElement("li");
                headingItem.textContent = card.heading;
                autocompleteList.appendChild(headingItem);
            });

            // Add matching card content
            matchingCards.forEach((card) => {
                const contentItem = document.createElement("li");
                contentItem.textContent = card.content;
                autocompleteList.appendChild(contentItem);
            });
        } else {
            // Hide the autocomplete overlay when the search input is empty
            autocompleteOverlay.style.display = "none";
        }
    });

    // Handle click on autocomplete suggestions
    autocompleteList.addEventListener("click", function (event) {
        searchInput.value = event.target.textContent;
        autocompleteOverlay.style.display = "none";
    });
});
