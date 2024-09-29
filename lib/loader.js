export function createLoader(color) {
    const loader = document.createElement("div")
    loader.classList.add("loader")
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div")
        dot.classList.add("dot")
        dot.style.backgroundColor = color
        loader.appendChild(dot)
    }
    return (loader)
}

