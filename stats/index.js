import { redirect } from "../lib/redirect.js"

const tabs = document.querySelectorAll(".tabs")
let online = JSON.parse(localStorage.getItem("online"))
const theme = localStorage.getItem("theme")

if(theme === "dark"){
    document.body.classList.add("dark")
}





for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', (e) => {
        const selected = document.querySelector(".selected")
        if (selected != null) {
            selected.classList.remove("selected")
        }

        const frameSelected = document.querySelector(".frame-select")

        if (frameSelected != null) {
            frameSelected.classList.remove("frame-select")
        }
        console.log(e.target.id + "-frame")
        const frame = document.getElementById(e.target.id + "-frame")
        e.target.classList.add("selected")
        console.log(frame);

        frame.classList.add("frame-select")
    })
}

function createBody() {
    const body = {
        "token": sessionStorage.getItem("token"),
    }
    console.log(body)
    return postJSON(body)
}

async function postJSON(donnees) {
    try {
        const reponse = await fetch("https://server.flashtype.fr:47000/stats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(donnees),
            "Access-Control-Allow-Origin": "*",

        });

        const resultat = await reponse.json();
        console.log(resultat);
        return resultat
    } catch (erreur) {
        console.error("Erreur :", erreur);
        alert("you doesn't have stats now, play at least 2 times to see your stats")
    }
}

async function getStats() {

    //get SVGs
    const SVGs = [
        "../assets/back-arrow.svg"
    ]

    const elements = [
        ".return"
    ]

    for (let i = 0; i < elements.length; i++) {
        const fetchedSVG = await fetch(SVGs[i])

        const responseSVG = await fetchedSVG.text()
        const selectedElement = document.querySelectorAll(elements[i])

        for (let j = 0; j < selectedElement.length; j++) {
            selectedElement[j].innerHTML = responseSVG

        }
    }



    let stats
    if (online === true) {
        stats = await createBody()
        if (stats === false) {
            redirect("../mp")
        }

    }
    else {
        stats = JSON.parse(localStorage.getItem("stats"))
    }
    console.log(stats)
    processStats(stats)
}

const newStats = {}

function processStats(stats) {

    if (stats === null) {
        alert("you doesn't have stats now, play at least 2 times to see your stats")
        return
    }

    newStats.errors = new Array()
    newStats.maxStreak = new Array()
    newStats.score = new Array()
    newStats.accuracy = new Array()
    newStats.totalWords = new Array()
    newStats.wordsFailed = new Array()
    newStats.games = stats.length
    newStats.mTime = new Array()
    newStats.wpm = new Array()
    newStats.successRate = new Array()



    for (let i = 0; i < stats.length; i++) {
        newStats.errors.push(stats[i].scores.errors)
        newStats.maxStreak.push(stats[i].scores.maxStreak)
        newStats.score.push(stats[i].scores.score)
        newStats.accuracy.push(stats[i].scores.accuracy)
        newStats.totalWords.push(stats[i].scores.totalWords)
        newStats.wordsFailed.push(stats[i].scores.wordsFailed)
        newStats.mTime.push(stats[i].mTime)
    }

    for (let i = 0; i < newStats.totalWords.length; i++) {
        const wpm = Math.round(newStats.totalWords[i] / (newStats.mTime[i] / 60))
        newStats.wpm.push(wpm)
    }

    for (let i = 0; i < newStats.totalWords.length; i++) {
        // console.log((newStats.wordsFailed[i] / newStats.totalWords[i]), newStats.wordsFailed[i], newStats.totalWords[i]);
        const successRate = Math.round((1 - (newStats.wordsFailed[i] / newStats.totalWords[i])) * 10000) / 100
        if (isNaN(successRate)) {
            newStats.successRate.push(0)
        }
        else {
            newStats.successRate.push(successRate)
        }
    }






    getMoreStats(newStats.errors, "errors", true)
    getMoreStats(newStats.maxStreak, "maxStreak")
    getMoreStats(newStats.score, "score")
    getMoreStats(newStats.accuracy, "accuracy", false, false)
    getMoreStats(newStats.successRate, "successRate", false, false)
    getMoreStats(newStats.totalWords, "totalWords")
    getMoreStats(newStats.wpm, "wpm", false, false)
    console.log(newStats);

    for (let i = 0; i < newStats.mTime.length; i++) {
        let sum = 0
        sum += newStats.mTime[i]
        if (i === newStats.mTime.length - 1) {
            newStats.total.time = sum
        }
    }

    displayScores(newStats)
}

function getMoreStats(array, name, inverted, total) {
    // newStats.best[name] = new Object()

    if (newStats.best === undefined) {
        newStats.best = {}
    }

    if (newStats.worst === undefined) {
        newStats.worst = {}
    }

    if (newStats.avg === undefined) {
        newStats.avg = {}
    }

    if (newStats.total === undefined) {
        newStats.total = {}
    }

    if (inverted === undefined || inverted === false) {
        newStats.best[name] = Math.max(...array)
        newStats.worst[name] = Math.min(...array)
    }
    else {
        newStats.best[name] = Math.min(...array)
        newStats.worst[name] = Math.max(...array)
    }
    let sum = 0
    for (let i = 0; i < array.length; i++) {
        sum += array[i]
    }

    if (total === undefined || total === true) {
        newStats.total[name] = sum
    }

    sum = sum / array.length
    newStats.avg[name] = Math.round(sum)


}


function displayScores() {

    const frames = document.querySelectorAll(".frames")
    createScoreElement("Games played", newStats.games, frames[3])


    for (let i = 0; i < frames.length; i++) {
        createScoreElement("Score", newStats[frames[i].id.split("-")[0]].score, frames[i])
        createScoreElement("Errors", newStats[frames[i].id.split("-")[0]].errors, frames[i])
        createScoreElement("Total words", newStats[frames[i].id.split("-")[0]].totalWords, frames[i])
        // createScoreElement("time", newStats[frames[i].id.split("-")[0]].time, frames[i])
    }

    //doesn't display in total tab
    for (let i = 0; i < frames.length - 1; i++) {
        createScoreElement("Max streak", newStats[frames[i].id.split("-")[0]].maxStreak, frames[i])
        createScoreElement("Accuracy", newStats[frames[i].id.split("-")[0]].accuracy, frames[i])
        createScoreElement("Success rate", newStats[frames[i].id.split("-")[0]].successRate, frames[i])
        createScoreElement("Wpm", newStats[frames[i].id.split("-")[0]].wpm, frames[i])
    }

    //only display on total tab
    createScoreElement("Total time played", newStats[frames[3].id.split("-")[0]].time, frames[3])
    const timePlayed = document.getElementById("Total-time-played-frame")
    timePlayed.innerHTML += "s"

}

function createScoreElement(name, value, elementToPlace) {
    // debugger
    const element = document.createElement("p")
    const textNode = document.createTextNode(name + ": " + value)

    element.setAttribute("id", name.split(" ").join("-") + "-frame")
    element.appendChild(textNode)
    elementToPlace.appendChild(element)
}

getStats()

