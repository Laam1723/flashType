let words = localStorage.getItem("words")
const primary = document.getElementById("primary")
const secondary = document.getElementById("secondary")
const body = document.body
let list
let listInv


if (words == undefined) {
}
else {
    words = JSON.parse(words)
}

async function getData() {
    const response = await fetch("./data.json") // data.json is exactly the same data as my hangman
    words = await response.json()
    console.log(words);
    localStorage.setItem("words", JSON.stringify(words))
    init()
}
getData()

function init() {
    let currentWord = getRandomWord()
    let nextWord = getRandomWord()
    writeWord(currentWord, primary)
    writeWord(nextWord, secondary)
    const caret = document.createElement("span")
    caret.setAttribute("id", "caret")
    primary.children[0].appendChild(caret)
    localStorage.setItem("currentWord", JSON.stringify(currentWord))
    localStorage.setItem("nextWord", JSON.stringify(nextWord))
    list = primary.children
    listInv = secondary.children

}
let i = 0
function keyPressed(event) {
    const currentWord = JSON.parse(localStorage.getItem("currentWord"))
    console.log(currentWord);
    console.log(currentWord[i].toUpperCase());
    if (event.key == currentWord[i].toLowerCase()) {
        list[i].setAttribute("data-status", "write")
        const caret = document.createElement("span")
        caret.setAttribute("id", "caret")
        if (i + 1 != list.length) {
            list[i + 1].appendChild(caret)
        }

        list[i].children[0].remove("caret")

        i++
        console.log(i, list.length);
        if (i == list.length) {
            endWord()
        }
    }
}

function endWord() {
    switchWord()
    i = 0
    const currentWord = JSON.parse(localStorage.getItem("currentWord"))
    const next = JSON.parse(localStorage.getItem("nextWord"))
    localStorage.setItem("currentWord", JSON.stringify(next))
    const newRandom = getRandomWord()
    localStorage.setItem("nextWord", JSON.stringify(newRandom))
    removeWordAndWrite(listInv, currentWord, newRandom, listInv[0].parentElement)

}

function removeWordAndWrite(elementToRemove, wordToRemove, choosedWord, element) {
    removeWord(elementToRemove, wordToRemove)
    writeWord(choosedWord, element)
}

function writeWord(choosedWord, element) {
    console.log(element);

    for (const letter of choosedWord) {
        const paraElement = document.createElement("p")
        paraElement.setAttribute("class", "wordPara")
        const letterParaElement = document.createTextNode(letter)
        paraElement.appendChild(letterParaElement)
        // console.log(whichSelected);
        element.appendChild(paraElement)
    }
}

function removeWord(elementToRemove, wordToRemove) {
    for (let i = 0; i < wordToRemove.length; i++) {
        elementToRemove[0].remove()
    }

}

function getRandomWord() {
    const random = Math.floor(Math.random() * 1000)
    const choosedWord = words.fr[random].split("")
    return choosedWord

}

function switchWord() {
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
    console.log(i);
    const caret = document.createElement("span")
    caret.setAttribute("id", "caret")
    list[0].appendChild(caret)

}


document.addEventListener('keydown', (e) => {
    keyPressed(e)
})