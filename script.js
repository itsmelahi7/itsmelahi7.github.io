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
/*
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
    pages: [],
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
        pageOpen();
        tabMenu();
        searchCard();
        onLevelSelection();
        homeEventListners();
    }, 1000);

    //globalEventListner();
    /*
    const selectImageButton = document.getElementById("selectImage");
    selectImageButton.addEventListener("click", function () {
        ipcRenderer.send("select-and-copy-image");
    });
    */
});

function homeEventListners() {
    qs("img.create-new-note").addEventListener("click", (event) => {
        createCard("");
    });
    qs(".back-home").addEventListener("click", toggleCardSection);
    qs("input.add-tag").addEventListener("click", (event) => {
        setAutoCompelete(event);
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
}

function setData() {
    var cards = sortArrayInRandomOrder(qq.cards);
    card = cards[0];
    updateTags();
    filter();
}

function setTaskUsingID(id) {}

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

function setCardEventListner() {
    qs(".back-home").addEventListener("click", toggleCardSection);
    qs(".delete.card").addEventListener("click", (event) => {
        for (var i = 0; i < qq.cards.length; i++) {
            if (qq.cards[i].id == card.id) {
                qq.cards.splice(i, 1);
                break;
            }
        }
        toggleCardSection();
        popupAlert("Note has been deleted");
        setTimeout(function () {
            removePopupAlert();
        }, 5000);
    });
    qs("textarea.heading").addEventListener("input", (event) => {
        card.heading = event.target.value;
        saveData();
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
            //updateTags();
        }
    });
    qsa(".caret").forEach((icon) => {
        icon.addEventListener("click", (event) => {
            event.target.parentElement.children[0].classList.toggle("hide");
            event.target.parentElement.children[1].classList.toggle("hide");
            event.target.parentElement.nextElementSibling.classList.toggle("hide");
        });
    });
    qs("button#add-link").addEventListener("click", addExternalLink);
    setQuestionEventListners();

    textareaAutoHeightSetting();
}
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
}

function deleteQuestion(id) {
    card.questions = card.questions.filter((que) => que.id !== id);
    qs(`#${id}`).remove();
    saveData();
    setTotalQuestions();
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
    fil_que = [];
    var tags = qsa(".search-section .tag-name");
    qq.cards.forEach((card) => {
        fil_que = fil_que.concat(card.questions);
    });
    var temp_arr = [];
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
    }

    fil_que = sortArrayInRandomOrder(fil_que);
    que_no = 0;
    if (fil_que.length != 0) {
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

function toggleCardSection() {
    qsa(".page-content > div").forEach((section) => {
        section.classList.toggle("hide");
    });
    show(".topbar");
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
    debugger;
    if (text) {
        qs("span.question").textContent = text;
        hide(".question-level");
        hide("button.random");
        return;
    }
    show(".question-level");
    show("button.random");

    qs("span.question").textContent = replaceTextWithMarkup(fil_que[que_no].text);
    card = getCardByID(fil_que[que_no].card_id);

    qsa(".question-level .level").forEach((level) => {
        level.addEventListener("click", function () {
            fil_que[que_no].level = level.textContent;
            if (level.textContent == "hard") {
                //setBodyClass("body-hard");
            } else if (level.textContent == "medium") {
                // setBodyClass("body-medium");
            } else if (level.textContent == "easy") {
                // setBodyClass("body-easy");
            }
            hide(".que-sec .que-level");
            saveData();

            openCard();
        });
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

function onLevelSelection() {
    qsa(".question-level .level").forEach((level) => {
        level.addEventListener("click", (event) => {
            //que.level = level.textContent;
            toggleCardSection();
            openCard();
        });
    });
}

function updateTags(event) {
    loadAllTags();
    setTimeout(function () {
        setAllTags();
    }, 1000);
}
var autocompleteList = document.createElement("div");
autocompleteList.className = "autocomplete-list";
document.body.append(autocompleteList);
autocompleteList.style.position = "absolute";

function selectAutoCompeleteInput(input, event, location) {
    if (!input) {
        // qsa("input").forEach((input, e) => {});
    } else {
        // setAutoCompelete(input, e, location);
    }
}

function setAutoCompelete(event) {
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
                addNewTag(name, event, "filter-question");
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

function setAllTags() {
    var all_tags = qs(".all-tags");
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
}
function loadAllTags() {
    const uniqueTags = new Set();
    qq.cards.forEach((card) => {
        card.tags.forEach((tag) => {
            uniqueTags.add(tag);
        });
        card.questions.forEach((que) => {
            que.tags.forEach((tag) => {
                uniqueTags.add(tag);
            });
        });
    });
    tags = Array.from(uniqueTags);
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
        setTotalQuestions();
    });

    setContentSpanTextareaToggle();
    setEventListnersOnTagSection();

    setEventListnersOnQuestions();
}

function createCard(heading_text) {
    debugger;
    var new_card = {
        id: getID(),
        heading: heading_text != undefined ? heading_text : "New card heading",
        content: "",
        tags: [],
        images: [],
        links: [],
        questions: [],
        create_date: getTodayDate(),
        update_date: getTodayDate(),
    };
    qq.cards.push(new_card);
    saveData();
    card = new_card;
    openCard();
    qs("textarea.heading").focus();
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
    if (qs(".card-section.hide")) toggleCardSection();

    qs(".card-section").innerHTML = getTemplate("card");

    //show(".card.main");
    //setEventListners();
    //hide(".que-sec");

    qs(".card-content textarea.heading").value = card.heading;
    qs(".card-content .text-content textarea").value = card.content;
    /*
    qs(".card-content .text-content span").innerHTML = replaceTextWithMarkup(card.content);
    if (card.content.trim() == "") {
        hide(".card-content .text-content span");
        show(".card-content .text-content textarea");
        qs(".card-content .text-content textarea").focus();
    } else {
        show(".card-content .text-content span");
        hide(".card-content .text-content textarea");
    }
    */
    var tags_div = qs(".tags.card");
    var tags_input_ele = qs(".card.tags input");
    card.tags.forEach((tag) => {
        addNewTag(tag, "", "card");
    });

    card.images.forEach((url) => {
        var img = createElement("img");
        img.src = url;
        qs(".image-list").append(img);
    });
    setTotalImages();

    var que_list = qs(".question-list");
    que_list.innerHTML = "";

    setTotalQuestions();
    if (card.questions.length != 0) {
        loadCardQuestions();
    }
    setTimeout(function () {
        triggerEventListners();
    }, 1000);
}

function setTotalQuestions() {
    qs(".personal-question .head-text").textContent = `Questions (${card.questions.length})`;
}
function setTotalImages() {
    qs(".image-section .head-text").textContent = `Images (${card.images.length})`;
}

function triggerEventListners() {
    setCardEventListner();
    return;
    setEventListners();
    textareaAutoHeightSetting();
    setEventListnersOnQuestions();
    setEventListnersOnTagSection();
}

function loadCardQuestions() {
    var questions = card.questions;
    var list = qs(".personal-question .question-list");
    questions.forEach((que) => {
        var div = createElement("div");
        div.className = "question main";
        div.id = que.id;
        div.innerHTML = getTemplate("question");

        div.querySelector("textarea").value = que.text;
        list.append(div);

        var tag_input = div.querySelector(".question.tags input");
        var tags = div.querySelector(".question.tags");
        que.tags.forEach((tag) => {
            var div = addNewTag(tag, "", "question");
            tags.insertBefore(div, tag_input);
            div.children[1].addEventListener("click", (event) => {
                div.remove();
                deleteTag(tag, que.id);
            });
        });
        return;
        if (fil_que[que_no].id == que.id) {
            div.style.backgroundColor = "var(--curr-que-bc)";
            div.querySelector(".tag-sec").style.backgroundColor = "var(--curr-que-bc)";
        }
        list.append(div);
        setEventListnersOnQuestions();
        setEventListnersOnTagSection();
    });
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

function createQuestion(event) {
    var new_question = {
        id: getID(),
        text: "",
        type: "",
        answer: "",
        card_id: card.id,
        tags: [],
        level: "hard",
        create_date: getTodayDate(),
        update_date: getTodayDate(),
        revision_date: getRevisiondate(0),
    };
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
    setQuestionEventListners();
    setTotalQuestions();
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
    popupAlert("Image is loading");
    interval_save_image = setInterval(saveImage, 1000);
}

function saveImage() {
    if (image_url != "") {
        card.images.push(image_url);
        saveData();
        console.log("IMAGE URL IS ADDED");
        let img = createElement("img");
        removePopupAlert();
        setTotalImages();
        img.src = image_url;
        qs(".image-list").append(img);
        console.log("IMAGE URL IS ADDED URL = " + image_url);
        image_url = "";

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
            debugger;
            var tag = div.children[0].textContent.split("-")[0].trim();
            addNewTag(tag, "all-tags", "filter-question");
        });
    } else if (from == "filter-question") {
        debugger;
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
    } else {
        setTimeout(function () {
            firsttime();
        }, 1000);
    }
}

function firsttime() {
    debugger;
    hide(".page-content");
    var div = createElement("div");
    div.className = "welcome";
    div.textContent = "Welcome to a new journey of learning";
    var btn = createElement("button");
    btn.textContent = "Create your first note";
    div.append(btn);
    btn.addEventListener("click", (event) => {
        show(".page-content");
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
