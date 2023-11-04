/*
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js"; // Import Firebase Storage

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCv2koOkHrqG_ioHoOU1vuDfI2KPwLNTZM",
    authDomain: "revise-480317.firebaseapp.com",
    projectId: "revise-480317",
    storageBucket: "revise-480317.appspot.com",
    messagingSenderId: "264373202075",
    appId: "1:264373202075:web:faca853c3021e78db36a3e",
    measurementId: "G-2VNZKXQP1Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get a reference to the Firebase Storage
const storage = getStorage(app);

export function uploadImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
        const file = e.target.files[0];
        popupAlert("Image is loading");
        interval_save_image = setInterval(saveImage, 1000);
        if (file) {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytes(storageRef, file);

            uploadTask
                .then(() => {
                    // Upload completed successfully, get the download URL
                    getDownloadURL(storageRef)
                        .then((downloadURL) => {
                            console.log("Image uploaded. URL: " + downloadURL);
                            image_url = downloadURL;
                            return downloadURL;
                        })
                        .catch((error) => {
                            console.error("Error getting download URL:", error);
                        });
                })
                .catch((error) => {
                    console.error("Error uploading image:", error);
                });
        }
    };

    input.click();
}
/*
// Function to save data as JSON in Firebase Storage
async function saveDataAsJson(data, fileName) {
    try {
        const storageRef = ref(storage, fileName);
        const jsonBlob = new Blob([JSON.stringify(data)], { type: "application/json" });

        await uploadBytes(storageRef, jsonBlob);
        console.log(`Data saved as ${fileName}`);
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

// Function to get data as JSON from Firebase Storage

async function getDataFB(fileName) {
    try {
        const storageRef = ref(storage, fileName);
        const url = await getDownloadURL(storageRef);
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting data:", error);
        return null;
    }
}
async function getDataFB(fileName) {
    try {
        console.log("Fetching data from", fileName);
        const storageRef = ref(storage, fileName);
        const url = await getDownloadURL(storageRef);

        const response = await fetch(url, {
            mode: "no-cors",
        });

        if (response.ok) {
            const data = await response.json(); // Assuming the data is in JSON format
            console.log("Data fetched successfully");
            return data;
        } else {
            console.error("Failed to fetch data. Status:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error getting data:", error);
        return null;
    }
}

// Example usage
const myData = { key: "MEHBOOB ELAHI" };

// Save data as JSON
getData();
setTimeout(function () {
    // saveDataAsJson(qq, "meee.json");
}, 3000);

//saveDataAsJson(qq, "meee.json");


getDataFB("myData.json").then((data) => {
    if (data) {
        console.log("Retrieved data:", data);
    } else {
        console.log("Data not found.");
    }
});


var ccc = {};
setTimeout(function () {
    getDataFB("meee.json").then((data) => {
        if (data) {
            ccc = data;
            console.log("Retrieved data:", data);
        } else {
            console.log("Data not found.");
        }
    });
}, 6000);
*/
// ------------ MY CODE

var qq = {
    cards: [],
    tasks: [],
    questions: [],
    today_questions: [],
    public_questions: [],
};
var card = {};
var fil_que = [];
var que_no = 0;
var tags = [];
var que, task;

document.addEventListener("DOMContentLoaded", function () {
    getData();
    loadPage("prac_que");

    setTimeout(function () {
        setData();
        topbarEventListner();
        homeEventListners();
        //pageOpen();
        //tabMenu();
        searchCard();
        //onLevelSelection();

        textareaAutoHeightSetting();
    }, 1000);

    //globalEventListner();
    /*
    const selectImageButton = document.getElementById("selectImage");
    selectImageButton.addEventListener("click", function () {
        ipcRenderer.send("select-and-copy-image");
    });
    */
});

function isDailyNoteExist(id) {
    for (var i = 0; i < qq.cards.length; i++) {
        if (qq.cards[i].id == id) {
            return qq.cards[i];
        }
    }
    return false;
}

function topbarEventListner() {
    qs(".create-new-note").addEventListener("click", (event) => {
        createCard("New Note Heading");
    });
    qs(".topbar .search.icon").addEventListener("click", (event) => {
        hide(".topbar .search.icon");
        show(".topbar .search-section");
        qs(".topbar .search-input").focus();
    });
    qs(".topbar .search-input").addEventListener("blur", (event) => {
        show(".topbar .search.icon");
        hide(".topbar .search-section");
    });
    qs(".topbar .bookmark").addEventListener("click", (event) => {
        //setBookmarkPages();
        toggleSectionDisplay("bookmark");
    });
    qs(".topbar .all-pages").addEventListener("click", (event) => {
        setAllCards();
        toggleSectionDisplay("all-pages");
        qsa(".all-pages td.heading").forEach((td) => {
            td.addEventListener("click", (event) => {
                var id = event.target.id;
                var card = getCardByID(id);
                openCard(card);
                toggleSectionDisplay("card");
            });
        });
    });
    qs(".topbar .home").addEventListener("click", (event) => {
        //setAllPages();
        //filter();
        toggleSectionDisplay("home");
    });
}

function homeEventListners() {
    //qs(".back-home").addEventListener("click", toggleSectionDisplay);

    var date = getFormattedDates();
    qs(".daily-note > h3 ").textContent = date[1];
    qs(".daily-note").addEventListener("click", (event) => {
        createCard("daily-note");
    });

    qsa(".caret").forEach((icon) => {
        icon.addEventListener("click", (event) => {
            var head_sec = getNearestAncestorWithClass(event.target, "head-sec");
            head_sec.children[0].classList.toggle("hide");
            head_sec.children[1].classList.toggle("hide");
            head_sec.nextElementSibling.classList.toggle("hide");
        });
    });
    qs(".task-section input").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            var input = event.target;
            if (input.value.trim() == "") {
                popupAlert("add some task text");
                setTimeout(function () {
                    removePopupAlert();
                }, 3000);
                return;
            }

            var div = createElement("div");
            div.className = "task main row";
            qq.tasks.push(input.value.trim());
            saveData();
            div.textContent = input.value;
            qs(".all-tasks").append(div);
            input.value = "";
            input.focus();
        }
    });
    qs("button.random").addEventListener("click", nextQuestion);

    qsa("input.add-tag").forEach((input) => {
        input.addEventListener("click", (event) => {
            setAutoCompelete(event);
        });
    });

    qs(".quick-question  .tags input").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            var input = event.target;
            var tag = input.value.trim().toLowerCase();
            addNewTag(tag, event, "quick");
            input.value = "";
            input.focus();
        }
    });
    qs(".add-quick-question").addEventListener("click", (event) => {
        var ta = qs(".quick-question textarea");
        if (ta.value.trim() == "") {
            return;
        }
        var que = createQuestion();

        que.text = ta.value.trim();
        qsa(".quick-question .tag-name").forEach((tag) => {
            tag = tag.textContent.trim().toLowerCase();
            if (!que.tags.includes(tag)) {
                que.tags.push(tag);
            }
        });
        saveData();

        ta.value = "";
        qsa(".quick-question .tag").forEach((tag) => {
            tag.remove();
        });
        ta.focus();
    });
    textareaAutoHeightSetting();
    console.log("homeEventListner");
}

function setData() {
    debugger;
    if (qq.cards && qq.cards.length > 0) {
        updateTags();
        filter();
    }
}

function setTaskUsingID(id) {}

function setAllCards() {
    var tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    // Iterate through qq.cards and populate the table
    qq.cards.forEach(function (card) {
        var row = document.createElement("tr");
        var headingCell = document.createElement("td");
        headingCell.className = "heading";
        headingCell.id = card.id;
        var linksCell = document.createElement("td");
        var imagesCell = document.createElement("td");
        var questionsCell = document.createElement("td");

        headingCell.textContent = card.heading;
        linksCell.textContent = card.links.length;
        imagesCell.textContent = card.images.length;
        questionsCell.textContent = card.questions.length;

        row.appendChild(headingCell);
        row.appendChild(linksCell);
        row.appendChild(imagesCell);
        row.appendChild(questionsCell);

        tableBody.appendChild(row);
    });
}

function searchCard() {
    const searchInput = document.querySelector(".search-card");
    const autocompleteOverlay = document.querySelector(".autocomplete-overlay");
    const autocompleteList = document.getElementById("autocomplete-list");

    searchInput.addEventListener("input", function () {
        var search_value = searchInput.value;
        const searchValue = searchInput.value.toLowerCase();
        const searchWords = searchValue.split(/\s+/); // Split search input into words
        const matchingCards = qq.cards.filter((card) => {
            const cardText = card.heading.toLowerCase() + " " + card.content.toLowerCase();
            return searchWords.every((word) => cardText.includes(word));
        });

        // Clear previous autocomplete suggestions
        autocompleteList.innerHTML = "";

        if (searchValue) {
            // Create and display autocomplete suggestions
            autocompleteOverlay.style.display = "block";

            // Add the searched text at the top
            const searchTextItem = document.createElement("li");
            searchTextItem.textContent = "New card: " + search_value;
            searchTextItem.className = "search-item new-card";
            autocompleteList.appendChild(searchTextItem);
            searchTextItem.addEventListener("click", (event) => {
                createCard(search_value);
            });

            // Add matching card headings
            matchingCards.forEach((card) => {
                const headingItem = document.createElement("li");
                headingItem.textContent = card.heading;
                headingItem.className = "search-item heading";
                headingItem.dataset.id = card.id;
                autocompleteList.appendChild(headingItem);
                headingItem.addEventListener("click", (event) => {
                    card = getCardByID(card.id);
                    openCard(card);
                });
            });

            // Add matching card content
            matchingCards.forEach((card) => {
                const contentItem = document.createElement("li");
                contentItem.textContent = card.content;
                contentItem.className = "search-item content";
                contentItem.dataset.id = card.id;
                autocompleteList.appendChild(contentItem);
                contentItem.addEventListener("click", (event) => {
                    card = getCardByID(card.id);
                    openCard(card);
                });
            });

            autocompleteOverlay.style.width = searchInput.offsetWidth + 50 + "px";
            autocompleteOverlay.style.top = searchInput.offsetTop + 25 + "px";
            autocompleteOverlay.style.left = searchInput.offsetLeft + "px";
        } else {
            // Hide the autocomplete overlay when the search input is empty
            autocompleteOverlay.style.display = "none";
        }
    });

    // Handle click on autocomplete suggestions
    autocompleteList.addEventListener("click", function (event) {
        searchInput.value = "";
        autocompleteOverlay.style.display = "none";
    });
}
var quill;

function setCardEventListner() {
    var ele = qs("textarea.heading");
    if (ele) {
        ele.addEventListener("input", (event) => {
            card.heading = event.target.value;
            saveData();
        });
    }
    qsa("input.add-tag").forEach((input) => {
        input.addEventListener("click", (event) => {
            setAutoCompelete(event);
        });
    });

    qs(".text-content textarea").addEventListener("input", (event) => {
        card.content = event.target.value;
        saveData();
    });
    qs(".card.tags input").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            var tag = event.target.value.trim();
            addNewTag(tag, event, "card");
            event.target.value = "";
            event.target.focus();
            updateTags();
        }
    });
    /*
    qsa(".card-body .caret").forEach((icon) => {
        icon.addEventListener("click", (event) => {
            var head_sec = getNearestAncestorWithClass(event.target, "head-sec");
            head_sec.children[0].classList.toggle("hide");
            head_sec.children[1].classList.toggle("hide");
            head_sec.nextElementSibling.classList.toggle("hide");
        });
    });
    */
    qs("button#add-link").addEventListener("click", addExternalLink);
    qs("button#add-image").addEventListener("click", getImageURL);

    qs(".card.main  .question.tags input").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            debugger;
            var tag = event.target.value.trim();
            addNewTag(tag, event, "question");
            event.target.value = "";
            event.target.focus();
            //updateTags();
        }
    });
    qs(".card.main button.add-question").addEventListener("click", (event) => {
        debugger;
        var ta = qs(".add-question-section textarea");
        if (ta.value.trim() == "") {
            return;
        }
        debugger;
        var que = createQuestion(card.id);
        que.text = ta.value.trim();
        qsa(".add-question-section .tag-name").forEach((tag) => {
            tag = tag.textContent;
            if (!que.tags.includes(tag)) que.tags.push(tag);
        });
        saveData();
        addQuestionInCards(que);
        qsa(".add-question-section .tag").forEach((tag) => {
            tag.remove();
        });
        ta.value = "";
        ta.focus();
    });
    hide("button.ql-clean");
    setQuestionEventListners();
    textareaAutoHeightSetting();
}

function addQuestionInCards(que) {
    var div = createElement("div");
    div.className = "question main";
    div.id = que.id;
    div.innerHTML = getTemplate("question");

    div.querySelector("span").textContent = que.text;
    var tags = div.querySelector(".tags");
    que.tags.forEach((tag) => {
        var div = createElement("div");
        div.className = "tag";
        div.textContent = tag;
        tags.append(div);
    });
    div.children[1].addEventListener("click", (event) => {
        debugger;
        var id = event.target.parentElement.id;
        var i = 0;
        qsa(".card-body .question-list .question.main").forEach((que, index) => {
            if (que.id == id) {
                i = index;
            }
            div.remove();
            card.questions = card.questions.filter((element, index) => index !== i);
            saveData();
        });
    });
    qs(".card-body .question-list").append(div);
}

var tttt = false;
function setQuestionEventListners() {
    qs(".add-new-question").addEventListener("click", createQuestion);
    qsa(".question.main textarea").forEach((ta) => {
        ta.addEventListener("input", (event) => {
            var ta = event.target;
            var id = getNearestAncestorWithClass(ta, "main").id;
            setQuestionUsingID(id);
            que.text = ta.value;
            saveData();
        });
    });

    /*
    qsa(".question.tags input").forEach((input) => {
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                var tag = event.target.value.trim();
                addNewTag(tag, event, "question");
                event.target.value = "";
                event.target.focus();
                //updateTags();
            }
        });
    });
    

    qsa(".delete.question").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            var id = getNearestAncestorWithClass(event.target, "main").id;
            deleteQuestion(id);
        });
    });
    */
    qsa(".card.main .card-tabs .tab").forEach((tab) => {
        tab.addEventListener("click", (event) => {
            debugger;
            /*
            if (tttt) {
                tttt = false;
                return;
            }
            tttt = true;
            */
            event.stopPropagation(); // Add this line to stop event propagation
            qsa(".card.main .card-tabs .tab").forEach((tt) => {
                if (tt != event.target) tt.classList.remove("active");
            });
            event.target.classList.toggle("active");

            qsa(".card.main .tab-section").forEach((tt) => {
                tt.classList.add("hide");
            });
            if (event.target.classList.contains("active")) {
                if (event.target.classList.contains("questions")) {
                    qs(".card.main .question-section").classList.remove("hide");
                } else if (event.target.classList.contains("images")) {
                    qs(".card.main .image-section").classList.remove("hide");
                } else if (event.target.classList.contains("links")) {
                    qs(".card.main .link-section").classList.remove("hide");
                }
            }
        });
    });
}

function deleteQuestion(id) {
    card.questions = card.questions.filter((que) => que.id !== id);
    qs(`#${id}`).remove();
    saveData();
    updateQuestionCount();
}

function setQuestionUsingID(id) {
    var cq = card.questions;
    for (var i = 0; i < cq.length; i++) {
        if (cq[i].id == id) {
            que = cq[i];
            return;
        }
    }
}

var image_url = "";

function setBodyClass(className) {
    // Remove the existing body class
    qs(".page-content.main").classList.remove("body-easy", "body-medium", "body-hard");

    // Add the new body class
    qs(".page-content.main").classList.add(className);
}

function pageOpen() {
    qs("button#home").addEventListener("click", function () {
        loadPage("prac_que");
    });
    qs("button#setting").addEventListener("click", function () {
        loadPage("setting");
    });

    qs("button#about-me").addEventListener("click", function () {
        loadPage("about");
    });
    qs("textarea.heading");
}

function tabMenu() {
    var menu_button = qs("#openMenu");
    menu_button.addEventListener("click", function () {
        qs("#tabOverlay").style.right = "0";
        show("#tabOverlay");
    });

    document.querySelector("#closeMenu").addEventListener("click", function () {
        closeTabOverlay();
    });
}

function loadPracQueEventListners() {
    setTimeout(function () {
        //setEventListners();
        //updateTags();
        //filter();
    }, 1000);
}

function closeTabOverlay() {
    qs("#tabOverlay").style.right = "-300px";
    hide("#tabOverlay");
}

function loadPage(pageName) {
    //debugger_;
    const mainContent = document.querySelector(".page-container");
    mainContent.innerHTML = "";
    var page_address = `${pageName}.html`;

    fetch(page_address)
        .then((response) => response.text())
        .then((content) => {
            mainContent.innerHTML = content;
        })
        .catch((error) => {
            console.error(`Error loading content: ${error}`);
        });
    closeTabOverlay();
    if (pageName == "prac_que") {
        loadPracQueEventListners();
    }
}

function filter() {
    debugger;
    var tags = qsa(".search-section .tag-name");
    var temp_arr = [];
    fil_que = [];
    qq.cards.forEach((card) => {
        fil_que = fil_que.concat(card.questions);
    });

    if (tags.length != 0) {
        tags.forEach((tag) => {
            tag = tag.textContent;

            fil_que.forEach((que) => {
                var card = getCardByID(que.card_id);
                if (card.tags.includes(tag)) {
                    temp_arr.push(que);
                } else if (que.tags.includes(tag)) {
                    temp_arr.push(que);
                }
            });
            fil_que = temp_arr;
            temp_arr = [];
        });

        tags.forEach((tag) => {
            qq.unlinked_questions.forEach((que) => {
                if (que.tags.includes(tag)) temp_arr.push(que);
            });
        });
    }
    fil_que = fil_que.concat(qq.unlinked_questions);

    que_no = 0;
    if (fil_que.length != 0) {
        fil_que = sortArrayInRandomOrder(fil_que);
        showQuestion();
    } else {
        showQuestion("No Question Found");
    }
}

function sortArrayInRandomOrder(array) {
    return array.sort(() => Math.random() - 0.5);
}

function nextQuestion() {
    que_no++;
    if (que_no < fil_que.length) {
        showQuestion();
    } else {
        filter();
    }
}

function toggleSectionDisplay(section) {
    qsa(".page-content .page-container > div").forEach((div) => {
        if (!div.classList.contains(section)) {
            div.classList.add("hide");
        } else {
            div.classList.remove("hide");
        }
    });
}

function popupAlert(message) {
    var div = createElement("div");
    div.className = "popup-alert";
    div.textContent = message;
    document.body.append(div);
}
function removePopupAlert() {
    qs(".popup-alert").remove();
}

function showQuestion(text) {
    if (text) {
        qs("span.question").textContent = text;
        hide(".question-level");
        hide("button.random");
        return;
    }
    show(".question-level");
    show("button.random");
    hide(".open-note");
    hide(".link-note");

    qs("span.question").textContent = replaceTextWithMarkup(fil_que[que_no].text);

    qsa(".question-level .level").forEach((level) => {
        level.addEventListener("click", function () {
            fil_que[que_no].level = level.textContent;
            saveData();
            var card_id = fil_que[que_no].card_id;
            if (card_id != "") {
                show(".open-note");
            } else {
                show(".link-note");
                popupAlert("question is not linked to any note");
                setTimeout(function () {
                    removePopupAlert();
                }, 3000);
            }
        });
    });
    qs(".open-note").addEventListener("click", (event) => {
        var id = fil_que[que_no].card_id;
        var card = getCardByID(id);
        openCard(card);
    });
    qs(".link-note").addEventListener("click", (event) => {
        var id = fil_que[que_no].card_id;
        var card = getCardByID(id);
        openCard(card);
    });
}

function getCardByID(id) {
    for (let i = 0; i < qq.cards.length; i++) {
        if (qq.cards[i].id === id) {
            return qq.cards[i];
        }
    }
    // Return null if the card with the specified ID is not found
    return null;
}

function updateTags(event) {
    loadAllTags();
    setTimeout(function () {
        //setAllTags();
    }, 1000);
}
var autocompleteList = document.createElement("div");
autocompleteList.className = "autocomplete-list";
document.body.append(autocompleteList);
autocompleteList.style.position = "absolute";

function selectAutoCompeleteInput(event) {
    qsa("input.add-tag").forEach((input) => {
        if (input.classList.contains("filter-question")) {
            setAutoCompelete(event, input, "filter-question");
        } else if (input.classList.contains("quick-question")) {
            setAutoCompelete(event, input, "quick-question");
        } else if (input.classList.contains("card")) {
            setAutoCompelete(event, input, "quick-question");
        }
    });
}

function setAutoCompelete(event) {
    debugger;
    var input = event.target;
    input.addEventListener("input", function () {
        var inputValue = input.value.toLowerCase();
        const matchingNames = tags.filter((name) => name.toLowerCase().includes(inputValue));

        autocompleteList.innerHTML = "";
        if (matchingNames.length === 0) {
            autocompleteList.classList.remove("active");
            return;
        }

        matchingNames.forEach((name) => {
            const item = document.createElement("div");
            item.textContent = name;

            item.addEventListener("click", function () {
                if (event.target.classList.contains("filter-question")) {
                    addNewTag(name, event, "filter-question");
                } else if (event.target.classList.contains("quick-question")) {
                    addNewTag(name, event, "quick");
                } else if (event.target.classList.contains("card")) {
                    addNewTag(name, event, "card");
                } else if (event.target.classList.contains("new-question")) {
                    addNewTag(name, event, "question");
                }

                input.value = "";
                input.focus();
                autocompleteList.classList.remove("active");
            });
            autocompleteList.appendChild(item);
        });
        autocompleteList.style.width = input.offsetWidth + "px";
        autocompleteList.style.top = input.offsetTop + 25 + "px";
        autocompleteList.style.left = input.offsetLeft + "px";
        autocompleteList.classList.add("active");
        autocompleteList.classList.remove("hide");
    });

    document.addEventListener("click", function (event) {
        if (!input.contains(event.target)) {
            autocompleteList.classList.remove("active");
            autocompleteList.classList.add("hide");
        }
    });
}

function loadAllTags() {
    const uniqueTags = new Set();
    qq.cards.forEach((card) => {
        card.tags.forEach((tag) => {
            uniqueTags.add(tag);
        });

        var questions = card.questions;
        questions.forEach((que) => {
            que.tags.forEach((tag) => {
                uniqueTags.add(tag);
            });
        });
    });

    var questions = qq.unlinked_questions;
    questions.forEach((que) => {
        que.tags.forEach((tag) => {
            uniqueTags.add(tag);
        });
    });

    tags = Array.from(uniqueTags);
}

function setAllTags() {
    return;
    var all_tags = qs(".all-tags");
    const tagCounts = {};

    // Iterate through qq.cards array
    qq.cards.forEach((card) => {
        // Get the tags associated with the card
        const cardTags = card.tags;

        // Iterate through qq.questions array
        qq.questions.forEach((question) => {
            // Check if the question is linked to the current card
            if (question.card_id === card.id) {
                // Iterate through the tags of the card and update tag counts
                cardTags.forEach((tag) => {
                    // Initialize the count if it doesn't exist
                    if (!tagCounts[tag]) {
                        tagCounts[tag] = 0;
                    }

                    // Increment the count for the current tag
                    tagCounts[tag]++;
                });
            }
        });
    });
    /*
    tags.forEach((tag) => {
        var i = 0;
        qq.cards.forEach((card) => {
            if (card.tags.includes(tag)) {
                i = i + card.questions.length;
            } else {
                card.questions.forEach((que) => {
                    if (que.tags.includes(tag)) {
                        i = i + 1;
                    }
                });
            }
        });

        var ttt = tag + " - " + i;
        addNewTag(ttt, "", "all tags");
        //all_tags.append(div);
    });
    */
}

function setEventListnersOnQuestions() {
    qsa(".per-que .que-list .que textarea").forEach((input) => {
        input.addEventListener("input", function (event) {
            var id = event.target.parentElement.id;
            var i;
            card.questions.forEach((que, index) => {
                if (que.id == id) {
                    i = index;
                }
            });
            card.questions[i].text = input.value;
            saveData();
        });
    });
}

function setEventListners() {
    var ele = qs("button#create-new-card");
    if (ele) ele.addEventListener("click", createCard);

    qs("button#random").addEventListener("click", nextQuestion);
    qs(`button#add-new-que`).addEventListener("click", function (event) {
        createQuestion(event);
        updateQuestionCount();
    });

    setContentSpanTextareaToggle();
    setEventListnersOnTagSection();

    setEventListnersOnQuestions();
}

function createCard(heading_text) {
    debugger;
    var heading = heading_text != undefined ? heading_text : "New card heading";
    var id;
    if (heading == "daily-note") {
        var date = getFormattedDates();
        var card = isDailyNoteExist(date[0]);
        if (card) {
            openCard(card);
            return;
        }

        id = date[0];
        heading = date[1];
    }
    if (heading_text == "empty") {
        id = "empty";
    }
    var new_card = {
        id: id != undefined ? id : getID(),
        heading: heading,
        content: "",
        tags: [],
        images: [],
        questions: [],
        links: [],
        create_date: getTodayDate(),
        update_date: getTodayDate(),
    };
    qq.cards.push(new_card);
    saveData();
    card = new_card;
    openCard(new_card);
}

function setEventListnersOnTagSection() {}
function setEventListnersOnTagSection2() {
    qsa(".add-tag-icon").forEach((icon) => {
        icon.addEventListener("click", function (event) {
            event.target.classList.toggle("hide");
            var input = event.target.previousElementSibling;
            input.classList.toggle("hide");
            input.focus();
        });
        var input = icon.previousElementSibling;
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                if (event.target.className.includes("search")) {
                    return;
                }
                addNewTag(tag, event);
                input.value = "";
                input.focus();
                updateTags();
            }
        });
        input.addEventListener("blur", function (event) {
            event.target.classList.toggle("hide");
            event.target.nextElementSibling.classList.toggle("hide");
        });
    });
}

function openCard(cc) {
    if (cc) card = cc;
    if (qs(".card-section.hide")) toggleSectionDisplay("card");

    qs(".card-section").innerHTML = getTemplate("card");
    qs(".card-content textarea.heading").value = card.heading;

    if (card.id.indexOf("-") != -1) {
        var span = createElement("span");
        span.className = "heading";
        span.textContent = card.heading;
        qs(".card-content textarea.heading").replaceWith(span);
    } else {
        qs("textarea.heading").focus();
    }

    //qs(".card-content .text-content textarea").value = card.content;
    debugger;
    quill = new Quill("#editor-container", {
        theme: "snow", // or 'bubble' if you prefer the bubble theme
    });
    loadCardTags();
    loadCardImages();
    loadCardQuestions();
    quill.root.innerHTML = card.content;
    var intervalId = setInterval(() => {
        var ele = qs(".card.main #editor-container");
        if (ele) {
            if (card.content === quill.root.innerHTML) return;
            card.content = quill.root.innerHTML;
            saveData();
        } else {
            clearInterval(intervalId);
        }
    }, 1000);
    setCardEventListner();
    textareaAutoHeightSetting();
}

function loadCardQuestions() {
    if (card.questions.length == 0) return;
    card.questions.forEach((que) => {
        addQuestionInCards(que);
    });
    updateQuestionCount();
}

function loadCardImages() {
    card.images.forEach((url) => {
        var div = createElement("div");
        div.className = "image main";
        div.innerHTML = getTemplate("image");

        div.children[0].src = url;

        qs(".image-list").append(div);
        div.querySelector(".fa-trash").addEventListener("click", (event) => {
            var child = getNearestAncestorWithClass(event.target, "main");
            var parent = child.parentElement;
            var index = Array.from(parent.children).indexOf(child);
            card.images = card.images.filter((_, i) => i !== index);
            saveData();
            updateImageCount();
            div.remove();
        });
        div.querySelector(".fa-copy").addEventListener("click", (event) => {
            copyToClipboard(div.children[0].src);
            popupAlert("image link is copied to clipboard");
            setTimeout(function () {
                removePopupAlert();
            }, 3000);
        });
    });
    updateImageCount();
}

function loadCardTags() {
    var tags_div = qs(".tags.card");
    var tags_input_ele = qs(".card.tags input");
    card.tags.forEach((tag) => {
        addNewTag(tag, "", "card");
    });
}

function getFormattedDates() {
    const today = new Date();

    // Format for "yyyy-mm-dd"
    const yyyy_mm_dd = today.toISOString().split("T")[0];

    // Format for "Month day, year" with "2nd", "3rd", etc.
    const options = { year: "numeric", month: "long", day: "numeric" };
    const month_day_year = today.toLocaleDateString(undefined, options);
    const day = today.getDate();
    const dayWithSuffix = getDayWithSuffix(day);

    return [yyyy_mm_dd, month_day_year.replace(String(day), dayWithSuffix)];
}

function getDayWithSuffix(day) {
    if (day >= 11 && day <= 13) {
        return day + "th";
    }
    switch (day % 10) {
        case 1:
            return day + "st";
        case 2:
            return day + "nd";
        case 3:
            return day + "rd";
        default:
            return day + "th";
    }
}
function updateQuestionCount() {
    qs(".card-tabs .questions").textContent = `Questions ${card.questions.length}`;
}
function updateImageCount() {
    qs(".card-tabs .images").textContent = `Images ${card.images.length}`;
}

function triggerEventListners() {
    setCardEventListner();
    return;
    setEventListners();
    textareaAutoHeightSetting();
    setEventListnersOnQuestions();
    setEventListnersOnTagSection();
}

function createPage() {
    console.log(arguments.callee.name + "()");
    data.pages.push({
        id: getID(),
        title: "",
        cards: [],
    });
    saveData();
}

function setContentSpanTextareaToggle() {
    var textarea = document.querySelector(".text-content textarea");
    var span = document.querySelector(".text-content span");

    textarea.addEventListener("input", function () {
        card.content = textarea.value;
        span.innerHTML = replaceTextWithMarkup(textarea.value);
        saveData();
    });
    textarea.addEventListener("blur", function () {
        if (textarea.value.trim() == "") return;
        span.classList.toggle("hide");
        textarea.classList.toggle("hide");
    });
    span.addEventListener("click", function () {
        span.classList.toggle("hide");
        textarea.classList.toggle("hide");
        textarea.focus();
        textareaAutoHeightSetting();
    });
}

function textareaAutoHeightSetting() {
    if (document.querySelectorAll("textarea")) {
        document.querySelectorAll("textarea").forEach((el) => {
            el.style.height = el.setAttribute("style", "height: " + el.scrollHeight + "px");
            el.classList.add("auto");
            el.addEventListener("input", (e) => {
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
            });
        });
        console.log("textarea auto height triggered");
        //clearInterval(intervalTA); // This stops the interval
    }
}

function createQuestion(card_id) {
    var new_question = {
        id: getID(),
        text: "",
        type: "",
        answer: "",
        card_id: card_id != undefined ? card_id : "",
        tags: [],
        level: "hard",
        create_date: getTodayDate(),
        update_date: getTodayDate(),
        revision_date: getRevisiondate(0),
    };
    if (card_id) {
        card.questions.push(new_question);
        updateQuestionCount();
    } else {
        qq.unlinked_questions.push(new_question);
    }
    saveData();
    return new_question;

    card.questions.unshift(new_question);
    //card.questions.push(new_question);
    saveData();

    var div = createElement("div");
    div.className = "question main";
    div.id = new_question.id;
    if (qs(".main .question-list.hide")) {
        qs(".personal-question .caret ").click();
    }
    div.innerHTML = getTemplate("question");
    var first_que = qs(".personal-question .question-list .question");
    qs(".personal-question .question-list").insertBefore(div, first_que);

    div.querySelector("textarea").focus();
    //setQuestionEventListners();
    //updateQuestionCount();
    textareaAutoHeightSetting();
}

function getNearestAncestorWithClass(element, className) {
    while (element) {
        if (element.classList && element.classList.contains(className)) {
            return element; // Found the ancestor with the class
        }
        element = element.parentElement;
    }
    return null; // No ancestor with the class found
}

function getTemplate(type) {
    if (type == "question") return qs(".question-template").innerHTML;
    if (type == "card") return qs(".templates.card-section").innerHTML;
    if (type == "link") return qs(".link-template").innerHTML;
    if (type == "image") return qs(".image-template").innerHTML;
}

function getID() {
    const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const idLength = 10;
    let id = "";
    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
    }
    return id;
}

function createElement(ele) {
    return document.createElement(ele);
}
var interval_save_image;
async function getImageURL() {
    uploadImage();
}

function saveImage(url) {
    if (image_url != "") {
        card.images.push(image_url);
        saveData();
        console.log("IMAGE URL IS ADDED");

        var div = createElement("div");
        div.className = "image main";
        div.innerHTML = getTemplate("image");

        div.children[0].src = image_url;
        removePopupAlert();
        updateImageCount();

        qs(".image-list").append(div);
        if (qs(".image-list.hide")) {
            qs(".image-section .caret ").click();
        }
        var last_child = qs(".image-list .image:last-child");
        last_child.scrollIntoView({ behavior: "smooth" });
        console.log("IMAGE URL IS ADDED URL = " + image_url);
        image_url = "";

        div.querySelector(".fa-trash").addEventListener("click", (event) => {
            var child = getNearestAncestorWithClass(event.target, "main");
            var parent = child.parentElement;
            var index = Array.from(parent.children).indexOf(child);
            card.images = card.images.filter((_, i) => i !== index);
            saveData();
            updateImageCount();
            div.remove();
        });
        div.querySelector(".fa-copy").addEventListener("click", (event) => {
            copyToClipboard(div.children[0].src);
            popupAlert("image link is copied to clipboard");
            setTimeout(function () {
                removePopupAlert();
            }, 3000);
        });
        clearInterval(interval_save_image);
    }
}

function globalEventListner() {
    document.addEventListener("click", (event) => {
        if (event.target.matches("button#add-image")) {
            getImageURL();
        }
        if (event.target.matches("textarea.heading")) {
            event.target.addEventListener("input", (event) => {
                card.heading = event.target.value;
                saveData();
            });
        }

        if (event.target.matches("input.add-tag")) {
            setAutoCompelete(event);
            var input = event.target;
            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    if (event.target.className.includes("search")) {
                        return;
                    }
                    var tag = input.value.trim().toLowerCase();
                    addNewTag(tag, event);
                    input.value = "";
                    input.focus();
                    updateTags(event);
                }
            });
        }
        if (event.target.matches("button.add-mcq-template")) {
            event.target.classList.add("hide");
            event.target.previousElementSibling.classList.remove("hide");
            event.target.previousElementSibling.previousElementSibling.classList.remove("hide");
            event.target.parentElement.previousElementSibling.value = "Question...\n(a)\n(b)\n(c)\n(d)";
            textareaAutoHeightSetting();
            var id = event.target.parentElement.parentElement.id;
            for (var i = 0; i < card.questions.length; i++) {
                if (card.questions[i].id == id) {
                    card.questions[i].type = "mcq";
                    card.questions[i].answer = "a";
                }
            }
        }
        if (event.target.matches("select")) {
            if (event.target.classList.contains("mcq")) {
                event.target.addEventListener("change", (event) => {
                    var id = getNearestAncestorWithClass(event.target, "que").id;
                    for (var i = 0; i < card.questions.length; i++) {
                        if (card.questions[i].id == id) {
                            card.questions[i].answer = event.target.value;
                            break;
                        }
                    }
                });
            }
        }
        if (event.target.matches("div.caret")) {
            event.target.parentElement.children[0].classList.toggle("hide");
            event.target.parentElement.children[1].classList.toggle("hide");
            event.target.parentElement.nextElementSibling.classList.toggle("hide");
        }
    });
}
//const document_event_listner = setInterval(globalEventListner, 1000);

function addNewTag(tag, event, from) {
    tag = tag.trim();
    if (tag == "") return;

    var div = createElement("div");
    div.className = "tag";
    div.innerHTML = `<div class="tag-name">${tag}</div>
                     <div class="tag-delete-icon">x</div>`;
    var is_duplicate = false;
    if (from == "card") {
        qsa(".card.tags .tag-name").forEach((div) => {
            if (div.textContent === tag) is_duplicate = true;
        });
        if (is_duplicate) return;
        var tags = qs(".card.tags");
        var input = qs(".card.tags input");
        div.children[1].addEventListener("click", (event) => {
            div.remove();
            deleteTag(tag, "card");
        });
        tags.insertBefore(div, input);
        if (event != "") {
            card.tags.push(tag);
            saveData();
        }
        return;
    } else if (from == "question") {
        if (event != "") {
            var tags = event.target.parentElement;
            tags.insertBefore(div, event.target);
            div.children[1].addEventListener("click", (event) => {
                div.remove();
            });
            return;

            var id = getNearestAncestorWithClass(event.target, "main").id;
            setQuestionUsingID(id);
            que.tags.push(tag);
            saveData();
            div.children[1].addEventListener("click", (event) => {
                div.remove();
                deleteTag(tag, id);
            });
        } else {
            return div;
        }
    } else if (from == "all tags") {
        div.children[1].remove();
        qs(".all-tags").append(div);
        div.children[0].addEventListener("click", (event) => {
            var tag = div.children[0].textContent.split("-")[0].trim();
            addNewTag(tag, "all-tags", "filter-question");
        });
    } else if (from == "filter-question") {
        var tags = qs(".filter-question.tags");
        if (event == "all-tags") {
            qsa(".filter-question.tags .tag").forEach((tag) => {
                tag.remove();
            });
        }
        var input = qs(".filter-question.tags input");
        tags.insertBefore(div, input);
        div.children[1].addEventListener("click", (event) => {
            div.remove();
            filter();
        });
        filter();
    } else if (from == "quick") {
        var tags = event.target.parentElement;
        tags.insertBefore(div, event.target);
        div.children[1].addEventListener("click", (event) => {
            div.remove();
        });
    }
    return;
    var is_duplicate = false;

    if (from) {
        return div;
    } else {
        is_duplicate = addTagInDataArray(tag, event, div);
    }
    if (!is_duplicate) {
        event.target.parentElement.insertBefore(div, event.target);
    }
    if (event.target.className.includes("search")) {
        filter();
    }
}

function deleteTag(tag, arg) {
    if (arg == "card") {
        card.tags = card.tags.filter((item) => item !== tag);
        saveData();
    } else {
        setQuestionUsingID(arg);
        que.tags = que.tags.filter((tt) => tt !== tag);
        saveData();
    }
}

function addTagInDataArray(tag, event, div) {
    var par_ele = event.target.parentElement;

    var all_tags = par_ele.querySelectorAll(".tag");
    for (var i = 0; i < all_tags.length; i++) {
        if (all_tags[i].children[0].textContent == tag) return true;
    }
    if (event.target.className.includes("search")) {
        div.children[1].classList.remove("hide");
        return false;
    }
    if (par_ele.classList.contains("card")) {
        if (!card.tags.includes(tag)) {
            card.tags.push(tag);
            saveData();
        }
    } else if (par_ele.classList.contains("que")) {
        var id = par_ele.parentElement.id;
        var i;
        card.questions.forEach((que, index) => {
            if (que.id == id) {
                i = index;
            }
        });
        if (!card.questions[i].tags.includes(tag)) {
            card.questions[i].tags.push(tag);
            saveData();
        }
    }
    return false;
}

function addExternalLink() {
    var div = createElement("div");
    div.className = "external-link main";
    div.innerHTML = getTemplate("link");
    var link_list = qs(".link-list");
    link_list.append(div);
    if (qs(".link-list.hide")) {
        qs(".link-section .caret").click();
    }
    div.children[0].focus();
    qs("#add-new-link").addEventListener("click", (event) => {
        if (qs(".link-text").value == "") {
            qs(".link-text").focus;
            return;
        } else if (qs(".link.url").value == "") {
            qs(".link.url").focus;
            return;
        } else {
            card.links.push({
                text: qs(".link-text").value.trim(),
                url: qs(".link.url").value.trim(),
            });
            saveData();
            var a = createElement("a");
            a.className = "link";
            a.textContent = qs(".link-text").value.trim();
            a.href = qs(".link.url").value.trim();
            a.target = "_blank";
            qs(".link-list").append(a);
            div.remove();
        }
    });
}

function copyToClipboard(text) {
    // Create a temporary input element
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);

    // Select the text in the input field
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices

    // Copy the selected text to the clipboard
    document.execCommand("copy");

    // Remove the temporary input element
    document.body.removeChild(input);
}

function getTodayDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function getCurrentcardID() {}

function getRevisiondate(num) {
    const today = new Date(); // Get the current date
    today.setDate(today.getDate() + num); // Add 'num' days to the current date

    const day = today.getDate().toString().padStart(2, "0"); // Format day with leading zero
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
}

function replaceTextWithMarkup(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>');
    text = text.replace(/\^\^(.*?)\^\^/g, '<span class="highlight">$1</span>');
    text = convertHeadings(text);
    text = text.replace(/(- )/gm, '<span class="bullet">•</span>');
    text = text.replace(/\n/g, "<br>");
    return text;
}
function convertHeadings(inputText) {
    // Define a regular expression to match headings
    const regex = /^(#{1,3})\s+([^\n]*)\n/gm;

    // Replace the matching patterns with the desired HTML
    const outputText = inputText.replace(regex, (match, headingLevel, text) => {
        const level = headingLevel.length;
        return `<span class="heading${level} heading">${text}</span>\n`;
    });

    return outputText;
}

function saveData() {
    saveDataInLocale("revise_app_data", qq);
}
function getData() {
    var data = getDataFromLocale("revise_app_data");
    if (data) {
        qq = data;
        return;
    } else {
        setTimeout(function () {
            firsttime();
        }, 1000);
    }
}

function firsttime() {
    hide(".page-content");
    var div = createElement("div");
    div.className = "welcome";
    div.textContent = "Welcome to a new journey of learning";
    var btn = createElement("button");
    btn.textContent = "Create your first note";
    div.append(btn);
    btn.addEventListener("click", (event) => {
        show(".page-content");
        debugger;
        createCard("My First Note");
        div.remove();
    });
    qs(".content").append(div);
}

function saveDataInLocale(key, array) {
    try {
        const jsonData = JSON.stringify(array);
        localStorage.setItem(key, jsonData);
        console.log(` Data with key "${key}" saved in locale successfully`);
    } catch (error) {
        console.error(`Error saving data with key "${key}" in local storage:`, error);
    }
}

function getDataFromLocale(key) {
    try {
        const jsonData = localStorage.getItem(key);
        if (jsonData === null) {
            console.log(`No local data is found for key: ${key}`);
            return null;
        }
        var data = JSON.parse(jsonData);
        console.log(`Local data for key "${key}"retrived successfully from locale`);
        return data;
    } catch (error) {
        console.error(`Error retrieving local data with key "${key}" from localStorage`);
        return null;
    }
}

function show(ele) {
    document.querySelector(ele).classList.remove("hide");
}
function hide(ele) {
    document.querySelector(ele).classList.add("hide");
}

function qs(ele) {
    return document.querySelector(ele);
}
function qsa(ele) {
    return document.querySelectorAll(ele);
}

var card_template = `<div class="heading-sec">
                        <i class="fa-solid visibility caret icon fa-caret-down hide "></i>
                        <i class="fa-solid visibility caret icon fa-caret-right hide"></i>
                        <textarea class="heading" rows="1"></textarea>
                    </div>
                    <div class="card-content main-content">
                        <div class="content">
                            <div class="text-content">
                                <span class="hide"></span>
                                <textarea class="" placeholder="Add some text"></textarea>
                            </div>
                            <div class="image-sec">
                                <div class="head-sec">
                                    <div class="head-text">Show image</div>
                                    <div class="head-text hide">Hide image</div>
                                    <button id="add-image">add image</button>
                                </div>
                                <div class="image-list main-content"></div>
                            </div>
                            <button id="add-image">add image</button>    
                            <div class="tag-sec card">
                                <div class="tag-label hide">
                                    <i class="fa-solid visibility caret icon fa-caret-down hide"></i>
                                    <i class="fa-solid visibility caret icon fa-caret-right"></i>
                                </div>
                                <label class="hide">Card Tags:</label>
                                <div class="tags">
                                    <input type="text" class="hide add-tag-input" placeholder="+ tag  " />
                                    <div class="add-tag-icon fa-solid fa-plus"></div>
                                </div>
                            </div>
                        </div>
                        

                        <div class="que-sec">
                            <div class="per-que">
                                <div class="tag-label">
                                    <i class="fa-solid visibility caret icon fa-caret-down hide"></i>
                                    <i class="fa-solid visibility caret icon fa-caret-right"></i>
                                    <label>Questions:</label>
                                    <button id="add-new-que">add new</button>
                                </div>
                                <div class="main-content hide">
                                    <div class="que-list"></div>
                                </div>
                            </div>
                            <div class="pub-que">
                            </div>
                        </div>
                    </div>`;

// Get the modal
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const captionText = document.getElementById("caption");

// Get the images in the image-list
const images = document.querySelectorAll(".image-list img");

// Keep track of the currently displayed image
let currentIndex = 0;

// Open the modal with the clicked image
images.forEach((image, index) => {
    image.addEventListener("click", () => {
        currentIndex = index;
        modal.style.display = "block";
        modalImage.src = image.src;
        captionText.textContent = image.alt;
    });
});

// Close the modal
const closeButton = document.querySelector(".close-button");
closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});

// Handle next and previous buttons
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImage.src = images[currentIndex].src;
    captionText.textContent = images[currentIndex].alt;
});

nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    modalImage.src = images[currentIndex].src;
    captionText.textContent = images[currentIndex].alt;
});

// Close the modal if the user clicks outside of the modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

function loadClient() {
    gapi.load("client", initClient);
}

function handleClientLoadError() {
    console.error("Failed to load the Google API Client Library.");
}

function initClient() {
    gapi.client
        .init({
            apiKey: "AIzaSyCv2koOkHrqG_ioHoOU1vuDfI2KPwLNTZM",
            clientId: "264373202075-iros614h9fu6octjqsri0m9tbbulb178.apps.googleusercontent.com",
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
            scope: "https://www.googleapis.com/auth/youtube.force-ssl",
        })
        .then(function () {
            // API is ready for use
        })
        .catch(function (error) {
            console.error("Error initializing the API client: " + error.message);
        });
}
function embedVideo(videoId) {
    gapi.client.youtube
        .list({
            part: "snippet",
            id: videoId,
        })
        .then(function (response) {
            var videoDetails = response.result.items[0].snippet;
            var videoTitle = videoDetails.title;

            // Create a video player or display the video using the videoDetails.
        });
}
