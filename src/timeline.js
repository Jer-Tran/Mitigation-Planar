import { getPartySize } from "./main.js"

var _secondsSeen = 120
var _instance

function setStyle(attr, val) {
    var r = document.querySelector(':root')
    r.style.setProperty(attr, val)
}

export function displayTimeline() {
    let tl = document.getElementById("timeline")
    let width = tl.offsetWidth
    // console.log((width / _secondsSeen))
    // Magic value but this somehow allows all time slots to be seen
    setStyle("--timeslot-width", ((width - 3 * _secondsSeen) / _secondsSeen) + "px")
    tl.innerHTML = ""
    let t = document.createElement("table")
    // -1 to leave space for timeline mechanics
    for (let i = -1; i < getPartySize(); i++) {
        let r = document.createElement("tr")
        var start = 12
        for (let j = start; j < _secondsSeen + start; j++) {
            let td = document.createElement("td")
            let d = document.createElement("div")
            // Handling instance mechanics labelling
            if (i == -1) {
                td.setAttribute("class","mech")
                td.style.border = 'none'
                if (j % 10 == 0) {
                    d.innerHTML = "mysterious mechanic " + parseInt(j / 10 + 1)
                }
            }
            // d.innerHTML = j
            td.appendChild(d)
            r.appendChild(td)
        }
        t.appendChild(r)
    }
    tl.appendChild(t)
}