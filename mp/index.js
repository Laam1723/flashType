// let token
async function postJSON(donnees) {
    try {
        const reponse = await fetch("http://server.enolak.fr:45000/signup", {
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
    console.log(serverResponse.exist)
    if (serverResponse.exist === false) {
        sessionStorage.setItem("token", serverResponse.token)
    }
    else {
        issue("This username already exist")
    }
}

const submitButton = document.getElementById("submit")
submitButton.addEventListener("click", () => {
    const username = document.getElementById("usernameSign")
    const password = document.getElementById("passwordSign")
    if (username.value === "" || password.value === "") {
        issue("Please fill all fields")
        console.error("Empty field")
    }
    else {
        submit([username.value, password.value])
    }


})
function issue(issue) {
    const error = document.getElementById("errors")
    if (error.childNodes.length > 0) {
        error.childNodes[0].remove()
    }
    
    const issuesContainer = document.createElement("p")
    const issuesNode = document.createTextNode(issue)
    issuesContainer.appendChild(issuesNode)
    error.appendChild(issuesContainer)
    error.classList.add("shake")
}



