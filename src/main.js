import { createJob, displayJobs, loadJobs } from "./jobs.js"
import { loadMits } from "./mitigation.js"
import { displayTimeline } from "./timeline.js"

var _party = []
var _partySize = 8

export function getPartySize() {
    return _partySize
}

function resetParty() {
    _party = []
    updateDisplay()
}

function changeOrder(from, to) {
    if (from < 0 || from >= _party.length) {
        console.log("invalid party memeber index")
        return
    }
    else if (to < 0 || to >= _party.length) {
        console.log("impossible move " + from + " to " + to)
        return
    }
    console.log("can, " + from + " to " + to)
    const member = _party[from]
    _party.splice(from, 1)
    _party.splice(to, 0, member)
    updateDisplay()
}

export function addMember(name) {
    // A check for party size
    if (_party.length >= _partySize) {
        console.log("party at max size")
        return
    }

    try {
        let x = createJob(name)
        _party.push(x)
        updateDisplay()
    }
    catch(err) {
        console.log("Unable to find job named: " + name)
    }
}

function removeMember(index) {
    if (index < 0 || index >= _party.length) {
        console.log("invalid party memeber index " + index)
        return
    }
    _party.splice(index, 1)
    updateDisplay()
}

function createLowerButtons(i) {
    let lower = document.createElement("div")
    lower.setAttribute("id", "order")

    let left = document.createElement("div")
    left.innerHTML = "<"
    left.onclick = function() { changeOrder(i, parseInt(i-1)) }
    let x = document.createElement("div")
    x.innerHTML = "X"
    x.onclick = function() { removeMember(i) }
    let right = document.createElement("div")
    right.innerHTML = ">"
    right.onclick = function() { changeOrder(i, parseInt(i)+1) }

    lower.appendChild(left)
    lower.appendChild(x)
    lower.appendChild(right)

    return lower
}

// Receives the list of mits
function createMitsDiv(mits) {
    let el = document.createElement("div")
    el.setAttribute("id", "miti-list")
    for (let i in mits) {
        el.appendChild(mits[i].getIcon())
    }

    return el
}

function updateDisplay() {
    displayParty()
    displayIcons()
    displayTimeline()
}

function displayParty() {
    let party = document.getElementById("party")
    party.innerHTML = "";
    let reset = document.createElement("div")
    reset.innerHTML = "reset button"
    reset.onclick = resetParty
    party.appendChild(reset)
    let plist = document.createElement("div")
    plist.setAttribute("id", "party-list")
    for (let i in _party) {
        // Create a div/something for each member
        let member = document.createElement("div")

        let lower = createLowerButtons(i)
        let mits = createMitsDiv(_party[i].mits)
        
        // All the appends
        member.appendChild(_party[i].getIcon())
        member.appendChild(lower)
        member.appendChild(mits)
        plist.appendChild(member)
    }
    party.appendChild(plist)
}

function displayIcons() {
    let el = document.getElementById("classes")
    el.innerHTML = ""
    let t = document.createElement("table")
    // -1 to leave space for timeline mechanics
    for (let i = -1; i < _partySize; i++) {
        let r = document.createElement("tr")
        let d = document.createElement("td")
        let slot = document.createElement("div")
        try {
            slot.appendChild(_party[i].getIcon())
        }
        catch {
            //pass
        }
        d.appendChild(slot)
        r.appendChild(d)
        t.appendChild(r)
    }
    el.appendChild(t)
}

function test() {
    // console.log(_party)
    addMember('paladin')
    // console.log(_party)
    addMember('rogue')
    console.log(_party)

    displayParty(_party)

    // var r = document.querySelector(':root')
    // r.style.setProperty('--icon-size', '50px')
}

function doError() {
    // console.log("send help")
}

function start(jobs, mits) {
    loadJobs(jobs)
    loadMits(mits)
    displayJobs()
    
    test()
}

// Must be done like this so it works 
fetch("./data/jobs.json").then(res => {return res.json();}).then(jobs => 
    fetch("./data/mitigation.json").then(res => {return res.json()}).then(mits => start(jobs, mits))
).catch(doError())
