import { createJob, displayJobs, loadJobs } from "./jobs.js"
import { loadMits } from "./mitigation.js"

var _party = []
var _partySize = 8

function resetParty() {
    _party = []
    displayParty()
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
    displayParty()
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
        displayParty()
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
    displayParty()
}

function displayMits() {
    let d = document.getElementById("mits")
    d.innerHTML = ""
    let el = document.createElement("div")
    el.setAttribute("id", "miti-list")
    for (let i in _party) {
        let div = document.createElement("div")
        let m = _party[i].mits
        for (let j in m) {
            div.appendChild(m[j].getIcon())
        }
        el.appendChild(div)
    }
    d.appendChild(el)
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

        let lower = document.createElement("div")
        lower.setAttribute("id", "order")

        let left = document.createElement("div")
        left.innerHTML = "<"
        left.onclick = function() { changeOrder(i, i-1) }
        let x = document.createElement("div")
        x.innerHTML = "X"
        x.onclick = function() { removeMember(i) }
        let right = document.createElement("div")
        right.innerHTML = ">"
        right.onclick = function() { changeOrder(i, parseInt(i)+1) }
        
        // All the appends
        member.appendChild(_party[i].getIcon())
        lower.appendChild(left)
        lower.appendChild(x)
        lower.appendChild(right)
        member.appendChild(lower)
        plist.appendChild(member)
    }
    party.appendChild(plist)

    displayMits()
}

function test() {
    // console.log(_party)
    addMember('paladin')
    // console.log(_party)
    addMember('rogue')
    console.log(_party)

    displayParty(_party)
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
