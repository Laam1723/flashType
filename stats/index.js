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

    if(stats === null){
        alert("you doesn't have stats now, playat least 2 times to see your stats")
        return
    }

    newStats.errors = new Array()
    newStats.maxStreak = new Array()
    newStats.score = new Array()
    newStats.accuracy = new Array()
    newStats.totalWords = new Array()
    newStats.games = stats.length
    newStats.mTime = new Array()
    newStats.wpm = new Array()


    for (let i = 0; i < stats.length; i++) {
        newStats.errors.push(stats[i].scores.errors)
        newStats.maxStreak.push(stats[i].scores.maxStreak)
        newStats.score.push(stats[i].scores.score)
        newStats.accuracy.push(stats[i].scores.accuracy)
        console.log(newStats.accuracy)
        newStats.totalWords.push(stats[i].scores.totalWords)
        // newStats.totalWords.push(stats[i].scores.totalWords)
        newStats.mTime.push(stats[i].mTime)
    }

    for (let i = 0; i < newStats.totalWords.length; i++) {
        const wpm = Math.round(newStats.totalWords[i] / (newStats.mTime[i] / 60))
        newStats.wpm.push(wpm)
    }



    getMoreStats(newStats.errors, "errors", true)
    getMoreStats(newStats.maxStreak, "maxStreak")
    getMoreStats(newStats.score, "score")
    getMoreStats(newStats.accuracy, "accuracy", false, false)
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
    createScoreElement("Games played", newStats.games, frames[3])
    for (let i = 0; i < frames.length; i++) {
        createScoreElement("Score", newStats[frames[i].id.split("-")[0]].score, frames[i])
        createScoreElement("Errors", newStats[frames[i].id.split("-")[0]].errors, frames[i])
        createScoreElement("TotalWords", newStats[frames[i].id.split("-")[0]].totalWords, frames[i])
        createScoreElement("MaxStreak", newStats[frames[i].id.split("-")[0]].maxStreak, frames[i])
    }

    for (let i = 0; i < frames.length-1; i++) {
        createScoreElement("Accuracy", newStats[frames[i].id.split("-")[0]].accuracy, frames[i])
        createScoreElement("Wpm", newStats[frames[i].id.split("-")[0]].wpm, frames[i])        
    }


}

function createScoreElement(name, value, elementToPlace) {
    const element = document.createElement("p")
    const textNode = document.createTextNode(name + ": " + value)
    element.setAttribute("id", name + "-frame")
    element.appendChild(textNode)
    elementToPlace.appendChild(element)
}

getStats()

