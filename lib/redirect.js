
function redirect(url){
    const redirect = document.createElement("a")
    redirect.setAttribute("href", url)
    redirect.style.display = "none"
    redirect.click()
}

export {redirect}