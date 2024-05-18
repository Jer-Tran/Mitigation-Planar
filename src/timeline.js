import { getPartySize } from "./main.js"

var _secondsSeen = 120
var _instance
var _mits = {}

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
        var start = 0
        for (let j = start; j < _secondsSeen + start; j++) {
            let td = document.createElement("td")
            let d = document.createElement("div")
            // Handling instance mechanics labelling
            if (i == -1) {
                td.setAttribute("class", "mech")
                td.style.border = 'none'
                try {
                    let m = _instance[j]
                    d.innerHTML = m['name']
                    d.title = d.innerText
                }
                catch {
                    // pass
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

function doError(msg) {
    console.log(msg)
}

export function loadInstance(fname) {
    // Something that prevents interaction while loading
    const path = "./instances/" + fname
    console.log("path is " + path)

    function loadInst(data) {
        _instance = data
        displayTimeline()
    }

    fetch(path).then(res => {return res.json();}).then(inst => 
        loadInst(inst)
    ).catch((error) => {
        console.log(error)
      })
    
}