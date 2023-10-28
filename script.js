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

const addImageButton = document.getElementById("addImage");
addImageButton.addEventListener("click", uploadImage);

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

var qq = {
    cards: [],
    pages: [],
};
var card = {};
var fil_que = [];
var que_no = 0;
var tags = [];

document.addEventListener("DOMContentLoaded", function () {
    getData();
    loadPage("prac_que");
    setTimeout(function () {
        pageOpen();
        tabMenu();
    }, 1000);

    globalEventListner();
    /*
    const selectImageButton = document.getElementById("selectImage");
    selectImageButton.addEventListener("click", function () {
        ipcRenderer.send("select-and-copy-image");
    });
    */
});
var image_url = "";

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
        setEventListners();
        updateTags();
        filter();
    }, 1000);
}

function closeTabOverlay() {
    qs("#tabOverlay").style.right = "-300px";
    hide("#tabOverlay");
}

function loadPage(pageName) {
    //debugger_;
    const mainContent = document.getElementById("page-content");
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
    var tags = qsa(".search-sec .tag-name");
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

function showQuestion(text) {
    hide(".card.main");
    show(".que-sec .que-level");
    //show(".que-sec");
    if (text) {
        qs(".que-sec span.que").textContent = text;
        return;
    }
    qs(".que-sec span.que").textContent = replaceTextWithMarkup(fil_que[que_no].text);

    qsa(".que-sec .level").forEach((level) => {
        level.addEventListener("click", function () {
            fil_que[que_no].level = level.textContent;
            hide(".que-sec .que-level");
            saveData();
            card = getCardByID(fil_que[que_no].card_id);
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

function updateTags(event) {
    loadAllTags();

    setAllTags();
    if (event) {
        setAutoCompelete(event);
    }
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
                input.value = ""; //input.value = name;
                addNewTag(name, event);
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

        var ttt = tag + " " + i;
        var div = addNewTag(ttt, "", "all tags");
        all_tags.append(div);
    });
}
function loadAllTags() {
    qq.cards.forEach((card) => {
        card.tags.forEach((tag) => {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        });
        card.questions.forEach((que) => {
            que.tags.forEach((tag) => {
                if (!tags.includes(tag)) {
                    tags.push(tag);
                }
            });
        });
    });
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
    qsa(".icon.caret").forEach((icon) => {
        icon.addEventListener("click", function (event) {
            event.target.parentElement.children[0].classList.toggle("hide");
            event.target.parentElement.children[1].classList.toggle("hide");
            event.target.parentElement.nextElementSibling.classList.toggle("hide");
        });
    });

    qs("button#random").addEventListener("click", nextQuestion);
    qs(`button#add-new-que`).addEventListener("click", function (event) {
        createQuestion(event);
    });

    setContentSpanTextareaToggle();
    setEventListnersOnTagSection();

    setEventListnersOnQuestions();
}

function createCard() {
    var new_card = {
        id: getID(),
        heading: "New card heading",
        content: "",
        tags: [],
        images: [],
        questions: [],
        create_date: getTodayDate(),
        update_date: getTodayDate(),
    };
    qq.cards.push(new_card);
    saveData();
    card = new_card;
    openCard();
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

function openCard() {
    //

    qs(".card.main").innerHTML = "";
    qs(".card.main").innerHTML = getTemplate("card");
    show(".card.main");
    //setEventListners();
    //hide(".que-sec");

    qs(".card-content .heading").value = card.heading;
    qs(".card-content .text-content textarea").value = card.content;
    qs(".card-content .text-content span").innerHTML = replaceTextWithMarkup(card.content);
    if (card.content.trim() == "") {
        hide(".card-content .text-content span");
        show(".card-content .text-content textarea");
        qs(".card-content .text-content textarea").focus();
    } else {
        show(".card-content .text-content span");
        hide(".card-content .text-content textarea");
    }

    var tags_div = qs(".card-content .tags");
    var tags_input_ele = qs(".card-content .tags input");
    card.tags.forEach((tag) => {
        if (tag != "") {
            var tag_div = addNewTag(tag, "", "load card");
            tags_div.insertBefore(tag_div, tags_input_ele);
        }
    });

    card.images.forEach((url) => {
        var img = createElement("img");
        img.src = url;
        qs(".image-list").append(img);
    });

    var que_list = qs(".per-que .que-list");
    que_list.innerHTML = "";

    if (card.questions.length != 0) loadCardQuestions();
    setTimeout(function () {
        triggerEventListners();
    }, 1000);
}

function triggerEventListners() {
    setEventListners();
    textareaAutoHeightSetting();
    setEventListnersOnQuestions();
    setEventListnersOnTagSection();
}

function loadCardQuestions() {
    var questions = card.questions;
    var list = qs(".per-que .que-list");
    questions.forEach((que) => {
        var div = createElement("div");
        div.className = "que";
        div.id = que.id;
        div.innerHTML = getTemplate("que");
        div.children[0].value = que.text;
        var bfr = div.querySelector(".tags input");
        var tags = div.querySelector(".tags");
        que.tags.forEach((tag) => {
            if (tag.trim() != "") {
                var dd = addNewTag(tag, "", "load card");
                tags.insertBefore(dd, bfr);
            }
        });
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

    var per_que = getNearestAncestorWithClass(event.target, "per-que");
    var list = per_que.querySelector(".que-list");
    var div = createElement("div");
    div.className = "que";
    div.id = new_question.id;
    div.innerHTML = getTemplate("que");
    var first_child = list.firstElementChild;
    list.insertBefore(div, first_child);
    var abc = per_que.querySelector(".fa-caret-down.hide");
    if (abc) {
        per_que.querySelector(".fa-caret-right").click();
    }
    setEventListnersOnQuestions();
    setEventListnersOnTagSection();
    per_que.querySelector(".que-list .que textarea").focus();
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
    if (type == "que") return qs(".question-template").innerHTML;
    if (type == "card") return qs(".card-template").innerHTML;
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
    interval_save_image = setInterval(saveImage, 1000);
}

function saveImage() {
    if (image_url != "") {
        card.images.push(image_url);
        saveData();
        console.log("IMAGE URL IS ADDED");
        let img = createElement("img");
        img.src = image_url;
        qs(".image-list").append(img);
        console.log("IMAGE URL IS ADDED URL = " + image_url);
        image_url = "";
        debugger;
        clearInterval(interval_save_image);
    }
}

function globalEventListner() {
    document.addEventListener("click", (event) => {
        if (event.target.matches("button#add-image")) {
            getImageURL();
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
    if (tag.trim() == "") return;

    var div = createElement("div");
    div.className = "tag";
    div.innerHTML = `<div class="tag-name">${tag}</div>
                     <div class="tag-delete-icon hide">x</div>`;
    div.addEventListener("click", function () {
        div.children[1].classList.toggle("hide");
    });
    div.children[1].addEventListener("click", function () {
        div.remove();
        if (event.target.className.includes("search")) {
            filter();
        }
    });
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
    }
}

function saveDataInLocale(key, array) {
    try {
        const jsonData = JSON.stringify(array);
        localStorage.setItem(key, jsonData);
        console.log(` Data with key "${key}" successfullt saved in locale`);
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
