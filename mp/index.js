let mode
async function postJSON(donnees) {
    try {
        const reponse = await fetch("http://server.enolak.fr:45000/" + mode, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(donnees),
        });

        const resultat = await reponse.json();
        console.log(resultat);
        return resultat
    } catch (erreur) {
        console.error("Erreur :", erreur);
    }
}

async function submit(data) {

    
    const donnees = {
        "username": data[0],
        "password": data[1]
    };
    const serverResponse = await postJSON(donnees);
    const login = document.getElementById("loginPage").querySelector(".messages")
    const signup = document.getElementById("signupPage").querySelector(".messages")
    console.log(serverResponse.exist)
    //when successfully created account
    if (serverResponse.exist === false && mode === "signup") {
        console.log(serverResponse);
        sessionStorage.setItem("token", serverResponse.token)
        redirect()

    }
    //when the username is already taken
    else if (serverResponse.exist === true && mode === "signup") {
        issue("This username already exist", signup)
    }
    //when successfully loged
    else if (serverResponse.exist === true && mode === "login") {
        sessionStorage.setItem("token", serverResponse.token)
        redirect()
    }
    //when the password is wrong
    else if (serverResponse.exist === "password") {
        issue("Invalid password", login)
    }
    else if(serverResponse.exist === false && mode === "login"){
        issue("This account doesn't exist", login)
    }
}



function redirect(){
    const mainPage = document.createElement("a")
    mainPage.setAttribute("href","/")
    mainPage.style.display = "none"
    document.body.appendChild(mainPage)
    mainPage.click()
}
const submitButton = document.querySelectorAll(".submitBtn")

for (let i = 0; i < submitButton.length; i++) {

    submitButton[i].addEventListener("click", (e) => {
        console.log(e.currentTarget.parentElement)
        getData(e.currentTarget.parentElement)
    })
}


function getData(element) {
    const username = element.querySelector(".username")
    const password = element.querySelector(".password")
    if (username.value === "" || password.value === "") {
        issue("Please fill all fields", element.querySelector(".messages"))
        console.error("Empty field")
    }
    else {
        console.log(element.id)
        mode = element.id.split("P")[0]
        submit([username.value, password.value])
    }
}
function issue(issue, errorElement) {
    if (errorElement.childNodes.length > 0) {
        errorElement.childNodes[0].remove()
    }

    const issuesContainer = document.createElement("p")
    const issuesNode = document.createTextNode(issue)
    issuesContainer.appendChild(issuesNode)
    errorElement.appendChild(issuesContainer)
    errorElement.classList.add("shake")
}

const accounts = document.querySelectorAll(".account")
for (let i = 0; i < accounts.length; i++) {
    accounts[i].addEventListener("click", (e) => {
        if (e.currentTarget.className.split(" ").includes("collapsed")) {
            if (e.currentTarget === accounts[0]) {
                accounts[1].classList.add("collapsed")
                accounts[0].classList.remove("collapsed")
                mode
            }
            else {
                accounts[0].classList.add("collapsed")
                accounts[1].classList.remove("collapsed")
            }
        }
    })

}



