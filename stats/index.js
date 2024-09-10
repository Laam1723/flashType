const tabs = document.querySelectorAll(".tabs")
// const test = document.querySelector("#general")



for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', (e) => {
        console.log(e)
        const selected = document.querySelector(".selected")
        if (selected != null) {
            selected.classList.remove("selected")
        }

        const frameSelected = document.querySelector(".frame-select")

        if (frameSelected != null) {
            frameSelected.classList.remove("frame-select")
        }

        const frame = document.getElementById(e.target.id + "-frame")
        e.target.classList.add("selected")
        frame.classList.add("frame-select")
        // console.log(selected.id)
    })
}

function getStats() {
    const stats = JSON.parse(localStorage.getItem("stats"))
    console.log(stats)
    processStats(stats)
}

const newStats = {}

function processStats(stats) {


    newStats.errors = new Array()
    newStats.maxStreak = new Array()
    newStats.score = new Array()
    newStats.successRate = new Array()
    newStats.totalWords = new Array()
    newStats.games = stats.length
    newStats.mTime = new Array()
    newStats.wpm = new Array()


    for (let i = 0; i < stats.length; i++) {
        newStats.errors.push(stats[i].scores.errors)
        newStats.maxStreak.push(stats[i].scores.maxStreak)
        newStats.score.push(stats[i].scores.score)
        newStats.successRate.push(stats[i].scores.successRate)
        newStats.totalWords.push(stats[i].scores.totalWords)
        newStats.mTime.push(stats[i].mTime)
    }

    for (let i = 0; i < newStats.totalWords.length; i++) {
        const wpm = Math.round(newStats.totalWords[i] / (newStats.mTime[i] / 60))
        newStats.wpm.push(wpm)
    }



    getMoreStats(newStats.errors, "errors", true)
    getMoreStats(newStats.maxStreak, "maxStreak")
    getMoreStats(newStats.score, "score")
    getMoreStats(newStats.successRate, "successRate", false, false)
    getMoreStats(newStats.totalWords, "totalWords")
    getMoreStats(newStats.wpm, "wpm", false, false)
    console.log(newStats);
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

    console.log();

}


function displayScores() {

    const frames = document.querySelectorAll(".frames")
    console.log(frames[0].id.split("-")[0]);
    for (let i = 0; i < frames.length; i++) {
        createScoreElement("score", newStats[frames[i].id.split("-")[0]].score, frames[i])
        createScoreElement("errors", newStats[frames[i].id.split("-")[0]].errors, frames[i])
        createScoreElement("totalWords", newStats[frames[i].id.split("-")[0]].totalWords, frames[i])
        createScoreElement("maxStreak", newStats[frames[i].id.split("-")[0]].maxStreak, frames[i])
        createScoreElement("successRate", newStats[frames[i].id.split("-")[0]].successRate, frames[i])
        createScoreElement("wpm", newStats[frames[i].id.split("-")[0]].wpm, frames[i])
    }


}

function createScoreElement(name, value, elementToPlace) {
    const element = document.createElement("p")
    const textNode = document.createTextNode(name + ":" + value)
    element.setAttribute("id", name)
    element.appendChild(textNode)
    elementToPlace.appendChild(element)
}

getStats()

