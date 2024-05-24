import { getPartySize } from "./main.js"

const defaultSeen = 180
const paddingSeen = 20
var _secondsSeen = defaultSeen
var _start = 0
var _instance
var _instLen = 0
var _mits = {}

function setStyle(attr, val) {
    var r = document.querySelector(':root')
    r.style.setProperty(attr, val)
}

export function displayTimeline() {
    let tl = document.getElementById("timeline")
    // I've lost the sauce with what I was doing here, so just a reminder for myself that this is about setting inner div sizes to balance so that we still see enough of the timeline
    // Maybe set it to a multiplier down the line
    let width = tl.offsetWidth
    let px = 1
    setStyle("--timeslot-width", px + "px")

    tl.innerHTML = ""
    let t = document.createElement("table")
    // -1 to leave space for timeline mechanics
    for (let i = -1; i < getPartySize(); i++) {
        let r = document.createElement("tr")
        for (let j = _start; j < _secondsSeen + _start; j++) {
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
                if (j % 60 == 0) {
                    d.innerText += '\n' + '|'
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
        console.log(_instLen)
        var keys = Object.keys(_instance)
        keys.sort( function(a,b) { return (parseInt(a) - parseInt(b)) } )
        console.log(keys)
        _instLen = parseInt(keys[keys.length - 1])
        resetSeen()
        if (_secondsSeen > _instLen) {
            _secondsSeen = _instLen + paddingSeen
        }
        console.log(_instLen)
        displayTimeline()
    }

    fetch(path).then(res => {return res.json();}).then(inst => 
        loadInst(inst)
    ).catch((error) => {
        console.log(error)
    })
    
}

function checkStart() {
    if (_start > _instLen) {
        _start = _instLen
    }

    if (_start < 0) {
        _start = 0
    }
}

export function moveStart(val) {
    // Assume present state can see at least 1 mech
    
    _start = _start + val
    checkStart()
    displayTimeline()
}

export function setStart(val) {
    _start = val
    checkStart()
    displayTimeline()
}

export function moveSeen(val) {
    if (_secondsSeen + val > 0){
        _secondsSeen += val
    }

    if (_secondsSeen > _instLen + paddingSeen && _instance != null) {
        _secondsSeen = _instLen + paddingSeen
    }
    displayTimeline()
}

export function resetSeen() {
    _secondsSeen = defaultSeen + paddingSeen
}