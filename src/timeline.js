import { getPartySize, getParty, getCursor, setCursor, capCursor } from "./main.js"

const defaultSeen = 240
const paddingSeen = 20
var _secondsSeen = defaultSeen
var _start = 0
var _instance
var _instLen = defaultSeen + paddingSeen
var _mits = {}
var _rowHeight = 39

function setStyle(attr, val) {
    var r = document.querySelector(':root')
    r.style.setProperty(attr, val)
}

setStyle("--row-height", (_rowHeight + 1) + "px")

function resetMits() {
    _mits = {}
}

export function displayTimeline() {
    // What if instead of all this bs, we just always render the entire fight, but shift the view
    // Zoom in/out is just affecting the timeslot width, while scrolling changes the offset position/margin/idk
    // This function would solely work to re-render the timeline if any of its contents change, while the other stuff can just affect style(?)

    let tl = document.getElementById("timeline")
    // I've lost the sauce with what I was doing here, so just a reminder for myself that this is about setting inner div sizes to balance so that we still see enough of the timeline
    // Maybe set it to a multiplier down the line
    let width = tl.offsetWidth
    let px = width / _secondsSeen
    setStyle("--timeslot-width", px + "px")

    let cur = getCursor()
    
    tl.innerHTML = ""
    let t = document.createElement("table")
    let p = getParty()
    t.setAttribute("id", "table")
    // -1 to leave space for timeline mechanics
    for (let i = -1; i < getPartySize(); i++) {
        let r = document.createElement("tr")
        for (let j = _start; j < _instLen + paddingSeen; j++) {
            let td = document.createElement("td")
            td.onclick = function() { setCursor(j); displayTimeline() }
            // Handling instance mechanics labelling
            if (i == -1) {
                let d = document.createElement("div")
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
                    d.innerText += '\n' + '|' // Checkout gradient borders later for a better way to do this
                }
                td.appendChild(d)
            }
            // Only caring about 
            else {
                if (j == cur) {
                    td.style.border = "1px solid black"
                }
                else if (j + 1 == cur) {
                    td.style.borderRight = "1px solid black"
                }
            }
            // d.innerHTML = j
            r.appendChild(td)
        }
        // Get mitlist for ith party member
        try {
            let mitList = p[i].getMits()
            for (var id in mitList) {
                // Get the id'th mit
                let mit = mitList[id]
                // Need to do something so that layered mits don't hide each other
                for (var id2 in mit.casts) {
                    // For each time it's casted, insert into tr
                    let t = mit.casts[id2]
                    let d = createMitDiv(mit, px, p[i].getNumMits(), p[i].getMitIndex(mit.name))
                    d.classList.add("no-right-click")
                    d.addEventListener('contextmenu', function() {mit.removeCast(t); displayTimeline(); return false;})

                    // Something that checks r.children.item(t) 's num of children and compare that with id, filling if not sufficient
                    r.children.item(t).appendChild(d)
                }
            }
            // TODO: Something to call the party side icons to redraw based on height
        }
        catch(error) { // pass
        }
        t.appendChild(r)
    }
    tl.appendChild(t)
}

function createMitDiv(mit, width, numMits, offset) {
    let d = document.createElement("div")
    d.classList.add("cast")
    var castHeight = _rowHeight / numMits
    d.style.height = castHeight + "px"
    d.style.marginTop = castHeight * offset + "px"

    let dur = document.createElement("div")
    let cd = document.createElement("div")
    dur.innerText = mit.name + "\n"
    dur.style.width = (mit.duration * width) + "px"
    dur.style.height = "inherit"
    dur.style.backgroundColor = "skyblue"

    cd.style.width = (mit.cooldown * width) + "px"
    cd.style.height = "inherit"
    cd.style.backgroundColor = "grey"
    cd.style.zIndex = "-2"

    d.appendChild(dur)
    d.appendChild(cd)
    return d
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
        resetMits()
        resetSeen()
        // if (_secondsSeen > _instLen) {
        //     _secondsSeen = _instLen + paddingSeen
        // }
        console.log(_instLen)
        // displayTimeline()
        if (getCursor() > _secondsSeen) {
            setCursor(_secondsSeen - 1)
            displayTimeline()
        }
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
    capCursor()
    displayTimeline()
}

export function setStart(val) {
    _start = val
    checkStart()
    capCursor()
    displayTimeline()
}

export function getStart() {
    return _start
}

export function moveSeen(val) {
    if (_secondsSeen + val > 0){
        _secondsSeen += val
    }

    if (_secondsSeen > _instLen + paddingSeen && _instance != null) {
        _secondsSeen = _instLen + paddingSeen
    }
    capCursor()
    displayTimeline()
}

export function resetSeen() {
    _secondsSeen = defaultSeen + paddingSeen
    try {
        if (_secondsSeen > _instLen) {
            _secondsSeen = _instLen + paddingSeen
        }
    }
    catch { //pass 

    }
    displayTimeline()
}

function checkTimeSlot(t, m) {
    try {
        _mits[t][m]
    }
    catch {
        _mits[t] = {}
    }

    // Make sure member exists
    try { _mits[t][m][0]} // If there isn't an element then we should remake anyways then
    catch {_mits[t][m] = {}}
}

export function addMiti(time, member, mit) {
    // Some check for no overlapping mits

    // Make sure time slot exists
    console.log(_mits)
    checkTimeSlot(time, member)

    let fx = function(dur, cd, m) {
        let i = 0
        console.log("len = " + dur)
        while (i < dur) {
            let t = time + i
            checkTimeSlot(t, member)
            _mits[t][member][m] = {"active": 1, "origin": time}
            i += 1
        }
        _mits[time][member][m]["active"] = 0

        while (i < cd) {
            let t = time + i
            checkTimeSlot(t, member)
            _mits[t][member][m] = {"active": 2, "origin": time}
            i += 1
        }
    }

    let x = mit.name
    try {
        _mits[time][member][x]["active"]
        console.log("mit already exists")
    }
    catch {
        fx(mit.duration, mit.cooldown, x)
    }
    // _mits[time][member].indexOf(x) === -1 ? fx(mit.duration, x) : console.log("mit already exists")
    // x = _mits[time][member]
    // x = ["a", "b"]
    // _mits[time][member] = ["a", "b"]
    // _mits[time][member]
    console.log(_mits)
    // console.log(time + " " + member)
    // console.log(mit)
    displayTimeline()
}

export function removeMiti() {
    console.log("x")
}

// Considering simplifying it to getting the mits at a specific time-slice
export function getMits() {
    return _mits
}

export function checkInView(time) {
    return (time >= _start && time < _secondsSeen + _start)
}

export function getViewLimit() {
    return _instLen + paddingSeen
}

export function getViewEnd() {
    return _start + _secondsSeen
}