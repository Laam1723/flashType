import { redirect } from "./lib/redirect.js"

const primary = document.getElementById("primary")
const secondary = document.getElementById("secondary")
const body = document.body
const timer = document.getElementById("timeElapsed")
const maxTimeDisplay = document.getElementById("maxTimeDisplay")
const restart = document.getElementById("restart")
const endScreen = document.getElementById("endScreen")
const settings = document.getElementById("settings")
const theme = document.getElementById("theme")

//time
const endless = document.getElementById("endless")
const t15s = document.getElementById("t15s")
const t30s = document.getElementById("t30s")
const t60s = document.getElementById("t60s")
const t120s = document.getElementById("t120s")
const tCustom = document.getElementById("custom")
const endGameBtn = document.getElementById("endGame")
let tCustomFocused = false


let words = localStorage.getItem("words")
let list
let listInv
let errorMode = true
let maxTime = localStorage.getItem("maxTime")
let time = 0
let intervalID
let infinit = false
let firstLetter = true

if (maxTime === null) {
    maxTime = 15
    localStorage.setItem("maxTime", maxTime)
}
else {
    JSON.parse(maxTime)
}

if (maxTime === "0") {
    infinit = true
}

updateDisplayedTime()


//score system
let score = 0
// let coins = localStorage.getItem("coins")
let lettersWritten = 0
let errors = 0
let errorsInWord = 0
let accuracy = 0
let successRate = 0
let wordsWritten = 0
let wpm = 0
let wordsFailed = 0
let wordFailedBool = false
let wordsLengthAvg = []
let streak = 0
let maxStreak = 0

//language
let lang = localStorage.getItem("lang")
const langSelect = document.getElementById("lang")
const knownLanguages = ["en", "fr", "es"]

//db
const syncDbBtn = document.getElementById("syncDbBtn")

//stats
let stats = localStorage.getItem("stats")
let saveStats = localStorage.getItem("saveStats")

//theme system
let themeSelected = localStorage.getItem("theme")
if (themeSelected === null) {
    themeSelected = "light"
    localStorage.setItem("theme", themeSelected)
}
else if(themeSelected === "dark"){
    body.setAttribute("data-theme","dark")
}
body.setAttribute("theme", themeSelected)

//multiplayer
let online = localStorage.getItem("online")
let showedWLCSreen = localStorage.getItem("welcomeScreen")
let token = sessionStorage.getItem("token")
const changeMode = document.getElementById("changeMode")
if (online === null) {
    online = false
    showedWLCSreen = null
}
else {
    online = JSON.parse(online)
}

console.log(token === null && online === true, online);

checkToken()
const welcomeScreen = document.getElementById("welcomeScreen")


if (showedWLCSreen === null) {
    welcomeScreen.style.display = "flex"
}

const offlineBtn = document.getElementById("offline")
const onlineBtn = document.getElementById("online")

offlineBtn.addEventListener("click", () => {
    online = false
    welcomeScreen.style.display = "none"
    localStorage.setItem("welcomeScreen", false)
    localStorage.setItem("online", false)
})

onlineBtn.addEventListener("click", () => {

    online = true
    welcomeScreen.style.display = "none"
    localStorage.setItem("welcomeScreen", false)
    localStorage.setItem("online", true)
    redirect("./mp")
})

function checkToken() {
    if (token === null && online === true) {
        redirect("./mp")
    }
}


if (online === true) {
    changeMode.classList.add("online")
}
else {
    changeMode.classList.add("offline")
}

//other
let gameEnded = false

if (saveStats === null) {
    saveStats = true
    localStorage.setItem("saveStats", saveStats)
}
else {
    saveStats = JSON.parse(saveStats)
}

if (stats === null) {
    stats = []
}
else {
    stats = JSON.parse(stats)
}


if (lang === null) {
    let userLang = navigator.language
    userLang = userLang.split("-")
    lang = userLang[0]
    localStorage.setItem("lang", lang)
}
else if (knownLanguages.includes(lang) === false) {
    lang = "en"
    localStorage.setItem("lang", lang)
}


langSelect.value = lang




if ((words === undefined) === false) {
    console.log("oui");
    words = JSON.parse(words)
}

function removeLoaders(){
    const loarders = document.querySelectorAll(".loader")
    for (let i = 0; i < loarders.length; i++) {
        loarders[i].remove()
    }
        
}

async function getData(onlyWords) {
    const response = await fetch("./data.json") // data.json is exactly the same data as my hangman
    words = await response.json()
    localStorage.setItem("words", JSON.stringify(words))

    if (onlyWords === true) {
        return
    }

    //get SVGs
    const SVGs = [
        "./assets/timer.svg",
        "./assets/settings.svg",
        "./assets/sun.svg",
        "./assets/moon.svg",
        "./assets/infinity.svg",
        "./assets/language.svg",
        "./assets/sync.svg",
        "./assets/stats-icon.svg",
        "./assets/online.svg",
        "./assets/offline.svg",
        "./assets/account.svg"

    ]

    const elements = [
        ".timerIcon",
        ".settingsIcon",
        ".sunIcon",
        ".moonIcon",
        ".infinityIcon",
        ".languageIcon",
        ".syncDb",
        ".stats-icon",
        ".onlineIcon",
        ".offlineIcon",
        ".loginIcon"

    ]

    for (let i = 0; i < elements.length; i++) {
        const fetchedSVG = await fetch(SVGs[i])

        const responseSVG = await fetchedSVG.text()
        const selectedElement = document.querySelectorAll(elements[i])

        for (let j = 0; j < selectedElement.length; j++) {
            selectedElement[j].innerHTML = responseSVG

        }
    }

    const timerSVG = await fetch("./assets/timer.svg")
    const settingsSVG = await fetch("./assets/settings.svg")
    const sunSVG = await fetch("./assets/sun.svg")
    const moonSVG = await fetch("./assets/moon.svg")

    const responseTimer = await timerSVG.text()
    const responseSettings = await settingsSVG.text()
    const responseSun = await sunSVG.text()
    const responseMoon = await moonSVG.text()

    const timersIcons = document.querySelectorAll(".timerIcon")
    const settingsIcons = document.querySelectorAll(".settingsIcon")
    const sunIcons = document.querySelectorAll(".sunIcon")
    const moonIcons = document.querySelectorAll(".moonIcon")

    for (let i = 0; i < timersIcons.length; i++) {
        const element = timersIcons[i]
        element.innerHTML = responseTimer
    }

    for (let i = 0; i < settingsIcons.length; i++) {
        const element = settingsIcons[i]
        element.innerHTML = responseSettings
    }

    for (let i = 0; i < sunIcons.length; i++) {
        const element = sunIcons[i]
        element.innerHTML = responseSun
    }

    for (let i = 0; i < moonIcons.length; i++) {
        const element = moonIcons[i]
        element.innerHTML = responseMoon
    }
    removeLoaders()

    init()
}
getData()
launching()
function launching() {
    settings.setAttribute("data-space", "deployed")
    const initWidth = settings.offsetWidth - 20
    const initHeight = settings.offsetHeight - 20

    console.log("to collapsed", "height", initHeight, "width", initWidth)

    document.documentElement.style.setProperty("--width-when-deployed", initWidth + "px")
    document.documentElement.style.setProperty("--height-when-deployed", initHeight + "px")
    settings.setAttribute("data-space", "collapsed")
    body.setAttribute("data-loaded", "true")

}

function init() {
    let currentWord = getRandomWord()
    let nextWord = getRandomWord()
    writeWord(currentWord, primary)
    writeWord(nextWord, secondary)
    const caret = document.createElement("span")
    caret.setAttribute("id", "caret")
    primary.children[0].appendChild(caret)
    console.log(primary.children[0]);
    
    localStorage.setItem("currentWord", JSON.stringify(currentWord))
    localStorage.setItem("nextWord", JSON.stringify(nextWord))
    list = primary.children
    listInv = secondary.children
    if (infinit == false) {
        timer.innerHTML = 0 + "s"
    }
    else {
        timer.innerHTML = "Endless"
    }
}
let caretPos = 0
let playing = false
function keyPressed(event) {
    if (firstLetter == true) {
        firstLetter = false
        body.setAttribute("data-status", "playing")
        playing = true
        startTimer()
        settings.setAttribute("data-space", "collapsed")
    }
    const currentWord = JSON.parse(localStorage.getItem("currentWord"))
    lettersWritten++
    if (event.key == "Alt") {
        return
    }

    else if (event.key == currentWord[caretPos].toLowerCase()) {
        list[caretPos].setAttribute("data-status", "write")
        nextLetter()
    }
    else if (errorMode == true) {
        list[caretPos].setAttribute("data-status", "wrong")
        errors++
        errorsInWord++
        wordFailedBool = true
        console.log(event.code)
        nextLetter()
    }
}

function startTimer() {
    console.log("timer started");
    intervalID = setInterval(checkTime, 1000)
}

function checkTime() {
    time++
    if (infinit === false) {
        if (time >= maxTime) {
            clearInterval(intervalID)
            endGame()
        }
        timer.innerHTML = time + "s"
    }

}

function nextLetter() {
    const caret = document.createElement("span")
    caret.setAttribute("id", "caret")
    if (caretPos + 1 != list.length) {
        list[caretPos + 1].appendChild(caret)
    }

    list[caretPos].children[0].remove("caret")

    caretPos++
    //console.log(i, list.length);
    if (caretPos == list.length) {
        endWord()
    }
}

function previousLetter() {
    const caret = document.createElement("span")
    caret.setAttribute("id", "caret")
    if (caretPos - 1 >= 0) {
        list[caretPos - 1].appendChild(caret)
        const currentLetter = list[caretPos].children[0]
        const previousParent = list[caretPos - 1]
        currentLetter.remove("caret")
        const attributRemoved = previousParent.getAttribute("data-status")
        previousParent.removeAttribute("data-status")
        if (attributRemoved == "wrong") {
            errors--
            errorsInWord--
            console.log(errorsInWord, wordsFailed)
            if (errorsInWord == 0) {
                wordFailedBool = false
            }
        }

        caretPos--;

    }
}

function endGame() {
    gameEnded = true
    playing = false
    body.setAttribute("data-status", "end")
    calcStats()
}

function restartGame() {
    removeWordAll()
    time = 0
    caretPos = 0
    firstLetter = true
    score = 0
    // coins = localStorage.getItem("coins")
    lettersWritten = 0
    errors = 0
    errorsInWord = 0
    accuracy = 0
    successRate = 0
    wordsWritten = 0
    wpm = 0
    wordsFailed = 0
    wordFailedBool = false
    wordsLengthAvg = []
    streak = 0
    maxStreak = 0
    gameEnded = false

    init()
    body.setAttribute("data-status", "start")
}

function removeWordAll() {
    const primaryWord = primary.children
    const primaryWordLength = primaryWord.length
    const secondaryWord = secondary.children
    const secondaryWordLength = secondaryWord.length

    primary.setAttribute("data-order", "first")
    secondary.setAttribute("data-order", "second")

    for (let i = 0; i < primaryWordLength; i++) {
        primaryWord[0].remove()
    }

    for (let i = 0; i < secondaryWordLength; i++) {
        secondaryWord[0].remove()
    }
}

function endWord() {
    switchWord()
    caretPos = 0
    const currentWord = JSON.parse(localStorage.getItem("currentWord"))
    wordsLengthAvg.push(currentWord.length)
    console.log(wordsLengthAvg);
    const next = JSON.parse(localStorage.getItem("nextWord"))
    localStorage.setItem("currentWord", JSON.stringify(next))
    const newRandom = getRandomWord()
    localStorage.setItem("nextWord", JSON.stringify(newRandom))
    removeWordAndWrite(listInv, currentWord, newRandom, listInv[0].parentElement)
    if (wordFailedBool == true) {
        wordFailedBool = false
        wordsFailed++
    }
    else {
        streak++
        if (maxStreak < streak) {
            maxStreak = streak
        }
    }
    wordsWritten++
}

function removeWordAndWrite(elementToRemove, wordToRemove, choosedWord, element) {
    removeWord(elementToRemove, wordToRemove)
    writeWord(choosedWord, element)
}

function writeWord(choosedWord, element) {
    //console.log(element);

    for (const letter of choosedWord) {
        const paraElement = document.createElement("p")
        paraElement.setAttribute("class", "wordPara")
        const letterParaElement = document.createTextNode(letter)
        paraElement.appendChild(letterParaElement)
        // //console.log(whichSelected);
        element.appendChild(paraElement)
    }
}

function removeWord(elementToRemove, wordToRemove) {
    for (let i = 0; i < wordToRemove.length; i++) {
        elementToRemove[0].remove()
    }

}

function getRandomWord() {
    console.log(lang);

    let dblength = 10 ** words[lang].length.toString().length
    console.log(10 ** words[lang].length.toString().length);
    let random = Math.floor(Math.random() * dblength)
    while (random >= words[lang].length) {
        random = Math.floor(Math.random() * dblength)
    }
    const choosedWord = words[lang][random].split("")
    return choosedWord

}

function switchWord() {
    body.setAttribute("data-animation", "true")
    const orderPrimary = primary.getAttribute("data-order")
    if (orderPrimary == "first") {
        primary.setAttribute("data-order", "second")
        secondary.setAttribute("data-order", "first")
        list = secondary.children
        listInv = primary.children

    }
    else {
        primary.setAttribute("data-order", "first")
        secondary.setAttribute("data-order", "second")
        list = primary.children
        listInv = secondary.children

    }
    //console.log(i);
    const caret = document.createElement("span")
    caret.setAttribute("id", "caret")
    list[0].appendChild(caret)

}

function sumArray(array) {
    let sum = 0
    let avg = 0
    for (let i = 0; i < array.length; i++) {
        sum = sum + array[i]
    }
    avg = sum / array.length
    return avg
}

function calcStats() {
    if (infinit === false) {
        wpm = Math.round(wordsWritten / (maxTime / 60))
        console.log(wordsWritten / (maxTime / 60))
    }

    else {
        wpm = Math.round(wordsWritten / (time / 60))
        console.log(wordsWritten / (time / 60))
    }

    accuracy = Math.round((1 - (errors / lettersWritten)) * 10000) / 100

    successRate = Math.round((1 - (wordsFailed / wordsWritten)) * 10000) / 100

    if (isNaN(successRate) || successRate === Infinity) {
        successRate = 0
    }



    score = Math.round((wpm * (accuracy/10) *sumArray(wordsLengthAvg)) - (errors * 2))
    if (score == Infinity || isNaN(score)) {
        score = 0
    }


    //save stat

    const gameStats = []
    gameStats.push(score)
    gameStats.push(errors)
    gameStats.push(accuracy)
    gameStats.push(wordsWritten)
    gameStats.push(wordsFailed)
    gameStats.push(maxStreak)
    console.log(gameStats);

    updateStat(gameStats);



    let test = 1
    try {
        if (saveStats === true) {
            console.log(stats)
            // localStorage.setItem("stats", JSON.stringify(stats))
        }


    }
    catch (e) {
        if (e.toString().startsWith("QuotaExceededError")) {
            if (confirm('you have reached the maximum number of saved games, by clicking on "yes" you will download your save file otherwise future games will no longer be saved in the statistics tab.')) {
                const pastStats = localStorage.getItem("stats")
                downloadFile("fTSave.txt", JSON.stringify(pastStats))
            }
            else {
                saveStats = false
                localStorage.setItem("saveStats", saveStats)
            }
        }

    }
    displayStats()
}

function formatBody(score) {
    if(sessionStorage.getItem("token") === null){
        redirect("./mp")
        return
    }
    const body = {
        "token": sessionStorage.getItem("token"),
        "stats": score
    }
    console.log(body)
    postJSON(body)
}

async function postJSON(data) {
    try {
        const reponse = await fetch("https://server.flashtype.fr:47000/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            "Access-Control-Allow-Origin": "*",

        });

        const resultat = await reponse.json();
        return resultat
    } catch (erreur) {
        console.error(erreur);
    }
}

function downloadFile(filename, content) {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", filename);

    element.style.display = "none";
    body.appendChild(element);

    element.click();
    body.remove(element);
}


function updateStat(gameStats) {
    const date = Date.now()
    const score = {
        "timeStamp": date,
        "mTime": time,
        "scores": {
            "score": gameStats[0],
            "errors": gameStats[1],
            "accuracy": gameStats[2],
            "totalWords": gameStats[3],
            "wordsFailed": gameStats[4],
            "maxStreak": gameStats[5]
        }
    }
    if (online === true) {
        formatBody(score)
    }
    else {
        stats.push(score)
    }

}


function updateDisplayedTime() {
    if (infinit == true && maxTime == 0) {
        settings.setAttribute("data-time", "endless")
        body.setAttribute("data-isEndless", "true")
        maxTimeDisplay.innerHTML = ""
    }
    else {
        infinit = false
        settings.setAttribute("data-time", "t" + maxTime + "s")
        body.setAttribute("data-isEndless", "false")
        maxTimeDisplay.innerHTML = "/" + maxTime + "s"
    }
}

function displayStats() {
    //remove all childrens
    for (let i = 0; i < endScreen.children[2].children.length; i++) {
        let element = endScreen.children[2].children[i].children
        if (element.length > 0) {
            for (let j = 0; j < element.length; j++) {
                element[j].remove()
            }
        }
    }

    for (let i = 0; i < endScreen.children[1].children.length; i++) {
        let element = endScreen.children[1].children[i].children
        console.log(element);
        if (element.length > 0) {
            for (let j = 0; j < element.length; j++) {
                element[j].remove()
            }
        }
    }

    const scoreSpan = document.createElement("span")
    // const coinsSpan = document.createElement("span")
    const errorsSpan = document.createElement("span")
    const accuracySpan = document.createElement("span")
    const wpmSpan = document.createElement("span")
    const sucessRateSpan = document.createElement("span")
    const totalWordsSpan = document.createElement("span")
    const streakSpan = document.createElement("span")


    const scoreText = document.createTextNode(score)
    // const coinsText = document.createTextNode(coins + " coins")
    const errorsText = document.createTextNode(errors)
    const accuracyText = document.createTextNode(accuracy + "%")
    const wpmText = document.createTextNode(wpm)
    const successRateText = document.createTextNode(successRate + "%")
    const totalWordsText = document.createTextNode(wordsWritten)
    const streakText = document.createTextNode(maxStreak)

    scoreSpan.appendChild(scoreText)
    // coinsSpan.appendChild(coinsText)
    errorsSpan.appendChild(errorsText)
    accuracySpan.appendChild(accuracyText)
    wpmSpan.appendChild(wpmText)
    sucessRateSpan.appendChild(successRateText)
    totalWordsSpan.appendChild(totalWordsText)
    streakSpan.appendChild(streakText)

    endScreen.children[1].children[0].appendChild(scoreSpan)
    // endScreen.children[1].children[1].appendChild(coinsSpan)
    endScreen.children[2].children[0].appendChild(errorsSpan)
    endScreen.children[2].children[1].appendChild(accuracySpan)
    endScreen.children[2].children[4].appendChild(wpmSpan)
    endScreen.children[2].children[2].appendChild(sucessRateSpan)
    endScreen.children[2].children[3].appendChild(totalWordsSpan)
    endScreen.children[2].children[5].appendChild(streakSpan)
}

restart.addEventListener("click", () => {
    restartGame()
})
addEventListener('keydown', (e) => {
    if (tCustomFocused == true) {
        return
    }

    if (e.code == "Space") {
        if (playing === false) {
            restartGame()
        }
    }
    else if (gameEnded === false) {
        if (e.code == "Backspace") {
            previousLetter()
        }
        else {
            keyPressed(e)
        }
    }

})


settings.addEventListener("click", (e) => {
    if (e.target.className == "timeSelector") {
        return
    }

    let attributeSet = settings.getAttribute("data-space")
    if (attributeSet == "collapsed" && playing === false) {
        settings.setAttribute("data-space", "deployed")
    }
    else {
        settings.setAttribute("data-space", "collapsed")
    }
    if (playing === false) {
        settings.setAttribute("data-firstAnimation", "false")
    }

})

endless.addEventListener("click", (e) => {
    maxTime = 0
    infinit = true
    localStorage.setItem("maxTime", maxTime)
    updateDisplayedTime()
    e.stopPropagation()
})

t15s.addEventListener("click", () => {
    maxTime = 15
    localStorage.setItem("maxTime", maxTime)
    updateDisplayedTime()
})

t30s.addEventListener('click', () => {
    maxTime = 30

    localStorage.setItem("maxTime", maxTime)
    updateDisplayedTime()
})

t60s.addEventListener('click', () => {
    maxTime = 60
    localStorage.setItem("maxTime", maxTime)
    updateDisplayedTime()
})

t120s.addEventListener('click', () => {
    maxTime = 120
    localStorage.setItem("maxTime", maxTime)
    updateDisplayedTime()
})

tCustom.addEventListener('focusin', () => {
    settings.setAttribute("data-time", "custom")

    tCustomFocused = true
    console.log(tCustomFocused);
})

tCustom.addEventListener('focusout', (e) => {
    tCustomFocused = false
    e.stopPropagation()
})

tCustom.addEventListener('change', () => {
    if (+tCustom.value <= 0) {
        tCustom.value = 1
    }
    else if (tCustom.value == "15") {
        settings.setAttribute("data-time", "t15s")
    }
    else if (tCustom.value == "30") {
        settings.setAttribute("data-time", "t30s")
    }
    else if (tCustom.value == "60") {
        settings.setAttribute("data-time", "t60s")
    }
    else if (tCustom.value == "120") {
        settings.setAttribute("data-time", "t120s")
    }
    else {
        settings.setAttribute("data-time", "custom")
    }
    maxTime = +tCustom.value
    updateDisplayedTime()
})

theme.addEventListener("click", (e) => {
    let theme = body.getAttribute("data-theme")

    if (theme == "dark") {
        body.setAttribute("data-theme", "light")
        localStorage.setItem("theme", "light")
    }

    else if (theme == "light") {
        body.setAttribute("data-theme", "dark")
        localStorage.setItem("theme", "dark")

    }


    e.stopPropagation()
})

endGameBtn.addEventListener("click", () => {
    endGame()
})

langSelect.addEventListener("click", (e) => {
    e.stopPropagation()
})

langSelect.addEventListener("change", () => {
    lang = langSelect.value
    localStorage.setItem("lang", lang)
    restartGame()
})

syncDbBtn.addEventListener("click", (e) => {
    getData(true)
    e.stopPropagation()
})


changeMode.addEventListener("click", (e) => {
    if (Array.from(e.currentTarget.classList).includes("online")) {
        online = false
        e.currentTarget.classList.add("offline")
        e.currentTarget.classList.remove("online")
        localStorage.setItem("online", false)
    }
    else if (Array.from(e.currentTarget.classList).includes("offline")) {
        online = true
        e.currentTarget.classList.add("online")
        e.currentTarget.classList.remove("offline")
        localStorage.setItem("online", true)
        checkToken()
    }
    e.stopPropagation()
})





let UA = navigator.userAgent
UA = UA.split(" ")

for (let element of UA) {
    if (element.startsWith("Mobile")) {
        alert("Warning phones aren't compatible please use a computer instead.")
    }
}

