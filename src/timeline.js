import { getPartySize } from "./main.js"

var _secondsSeen = 120

function setStyle(attr, val) {
    var r = document.querySelector(':root')
    r.style.setProperty(attr, val)
}

export function displayTimeline() {
    let tl = document.getElementById("timeline")
    let width = tl.offsetWidth
    setStyle("--timeslot-width", (width / _secondsSeen) + "px")
    tl.innerHTML = ""
    let t = document.createElement("table")
    for (let i = 0; i < getPartySize(); i++) {
        let r = document.createElement("tr")
        for (let j = 0; j < _secondsSeen; j++) {
            let d = document.createElement("td")
            r.appendChild(d)
        }
        t.append(r)
    }
    tl.appendChild(t)
}