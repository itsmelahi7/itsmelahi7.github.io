//const { ipcRenderer } = require("electron");

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
    qq.cards.forEach((card) => {
        fil_que = fil_que.concat(card.questions);
    });
    fil_que = sortArrayInRandomOrder(fil_que);
    que_no = 0;
    showQuestion();
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

function showQuestion() {
    return;
    hide(".card.main");
    //show(".que-sec");
    qs(".que-sec span.que").textContent = replaceTextWithMarkup(fil_que[que_no].text);
    qsa(".que-sec .level").forEach((level) => {
        level.addEventListener("click", function () {
            fil_que[que_no].level = level.textContent;
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
        fil_que.forEach((que) => {
            var card = getCardByID(que.card_id);
            if (card.tags.includes(tag)) ++i;
            else if (que.tags.includes(tag)) ++i;
        });

        var ttt = tag + " " + i;
        var div = addNewTag(ttt, "", "text");
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

    qs("#add-image").addEventListener("click", addImage);

    setContentSpanTextareaToggle();
    setEventListnersOnTagSection();

    setEventListnersOnQuestions();
}

function addImage() {
    const imageUploadButton = document.getElementById("imageUploadButton");
    const imageInput = document.getElementById("imageInput");

    imageUploadButton.addEventListener("click", () => {
        // Trigger the file input dialog when the button is clicked
        imageInput.click();
    });
    //imageInput = document.getElementById("imageInput"); // Assuming 'imageInput' is the ID of your file input element

    imageInput.addEventListener("change", (event) => {
        const selectedImage = event.target.files[0];

        if (selectedImage) {
            const imageURL = URL.createObjectURL(selectedImage);
            const imgElement = document.createElement("img");
            imgElement.src = imageURL;
            console.log(imageURL);

            document.body.appendChild(imgElement);
            console.log(imageURL);
        }
    });
}

function createCard() {
    console.log(arguments.callee.name + "()");
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
    console.log(arguments.callee.name + "()");

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

function addImage() {
    // Create an input element of type 'file'
    const input = document.createElement("input");
    input.type = "file";

    // Set the accept attribute to specify that only image files can be selected
    input.accept = "image/*";

    // Add an event listener to handle file selection
    input.addEventListener("change", function () {
        const file = input.files[0]; // Get the selected file
        if (file) {
            const imageURL = URL.createObjectURL(file); // Create a URL for the selected file
            //alert(`Selected Image URL: ${imageURL}`);
            card.images.push(imageURL);
            saveData();
            var img = createElement("img");
            img.src = imageURL;
            qs(".card .image-list").append(img);
        }
    });

    // Trigger a click event to open the file dialog
    input.click();
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
    console.log(arguments.callee.name + " called");
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
    console.log(arguments.callee.name + " called");
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
    console.log(arguments.callee.name + " called");
    return document.createElement(ele);
}

function globalEventListner() {
    document.addEventListener("click", (event) => {
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
            debugger;
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
    });
    var is_duplicate = false;
    debugger;
    if (from) {
        return div;
    } else {
        is_duplicate = addTagInDataArray(tag, event, div);
    }
    if (!is_duplicate) {
        event.target.parentElement.insertBefore(div, event.target);
    }
}

function addTagInDataArray(tag, event, div) {
    var par_ele = event.target.parentElement;

    var all_tags = par_ele.querySelectorAll(".tag");
    for (var i = 0; i < all_tags.length; i++) {
        debugger;
        if (all_tags[i].children[0].textContent == tag) return true;
    }
    if (event.target.className.includes("search")) {
        div.children[1].classList.remove("hide");
        //filter();
        return false;
    }
    if (par_ele.classList.contains("card")) {
        if (!card.tags.includes(tag)) {
            card.tags.push(tag);
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
        }
    }
    return false;
}

function getTodayDate() {
    console.log(arguments.callee.name + " called");
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function getCurrentcardID() {
    console.log(arguments.callee.name + " called");
}

function getRevisiondate(num) {
    console.log(arguments.callee.name + " called");
    const today = new Date(); // Get the current date
    today.setDate(today.getDate() + num); // Add 'num' days to the current date

    const day = today.getDate().toString().padStart(2, "0"); // Format day with leading zero
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
}

function replaceTextWithMarkup(text) {
    console.log(arguments.callee.name + " called");

    text = text.replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>');
    text = text.replace(/\^\^(.*?)\^\^/g, '<span class="highlight">$1</span>');
    text = convertHeadings(text);
    text = text.replace(/(- )/gm, '<span class="bullet">•</span>');
    text = text.replace(/\n/g, "<br>");
    return text;
}
function convertHeadings(inputText) {
    console.log(arguments.callee.name + " called");
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

async function addFile() {
    let [fileHandle] = await window.showOpenFilePicker();
    var data = await fileHandle.getFile();
    if (!data.type.includes("image")) {
        alert("select an image file");
        return;
    }
}
