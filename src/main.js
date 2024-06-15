import { createJob, displayJobs, loadJobs } from "./jobs.js"
import { loadMits } from "./mitigation.js"
import { displayTimeline, loadInstance, moveStart, setStart, getStart, moveSeen, resetSeen, addMiti, removeMiti, checkInView, getViewLimit, getViewEnd } from "./timeline.js"

var _party = []
var _partySize = 8
var _instances = []
var _cursor = 15

export function getPartySize() {
    return _partySize
}

export function getParty() {
    return _party
}

export function getCursor() {
    return _cursor
}

export function setCursor(val) {
    _cursor = val
    displayTimeline()
}

export function capCursor() {
    let limit = getViewLimit()

    if (_cursor >= limit && limit != 20) {
        _cursor = getViewLimit() - 1
    }

    // Something something ensure the cursor is always in view
    if (_cursor > getViewEnd() && limit != 20) {
        _cursor = getViewEnd()
    }

    if (_cursor < getStart()) {
        _cursor = getStart()
    }
}

function moveCursor(val) {
    _cursor += val
    if (_cursor < 0) {
        _cursor = 0
    }

    let limit = getViewLimit()
    // If cursor moves and there's still stuff, also move the start
    if (!checkInView(_cursor) && _cursor < limit) {
        moveStart(val)
    }
    capCursor()
    displayTimeline()
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
function createMitsDiv(mits, member) {
    let el = document.createElement("div")
    el.setAttribute("id", "miti-list")
    for (let i in mits) {
        let icon = mits[i].getIcon()
        // Thinking: should we entertain the case where we have multiple of the same mit, like 2 stacks of reprisal or something, for now no
        icon.onclick = function() { 
            // addMiti(_cursor, member, mits[i])
            // Then do something to change the button's function or some way to remove mits
            mits[i].insertCast(_cursor)
            displayTimeline()
        }
        // Add an ondrag event, so we can place mits on timeline using this
        el.appendChild(icon)
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
        let mits = createMitsDiv(_party[i].mits, i)
        
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
        let d = document.createElement("td") // TODO: Add something to adjust the heights based on the number of mits
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

// Opens the drop down menu thing
function displayInstanceList() {
    // Toggles between
    document.getElementById("instance-dropdown").style.display = "block";

    window.onclick = function(event) {
        if (!event.target.matches('.instance')) {
            hideInstanceList()
            window.onclick = function () {} // Removes itself when not needed
        }
    }
}

// Closes drop down menu to do normal things again
function hideInstanceList() {
    // do stuff
    document.getElementById("instance-dropdown").style.display = "none";
}

function setInstance(inst) {
    let curr = document.getElementById("instance-active")
    curr.innerHTML = ""
    let ico = document.createElement("img")
    ico.src = inst['icon']
    ico.classList = "instance small-icon"
    let name = document.createElement("div")
    name.innerHTML = inst['name']
    name.className = "instance"
    curr.appendChild(ico)
    curr.appendChild(name)
    loadInstance(inst['file'])
}

function loadInstanceList(insts) {
    let drop = document.getElementById("instance-dropdown")
    drop.innerHTML = ""
    for (let i in insts) {
        let inst = document.createElement("div")
        inst.className = "inst-tab"
        let ico = document.createElement("img")
        ico.src = insts[i]['icon']
        ico.className = "small-icon"
        let name = document.createElement("div")
        name.innerText = insts[i]['name']
        inst.appendChild(ico)
        inst.appendChild(name)
        
        inst.onclick = function() { setInstance(insts[i]) }
        drop.appendChild(inst)
    }
}

function generateInstanceList() {
    // let inst = document.getElementById("instance")

    document.getElementById("instance-active").onclick = displayInstanceList

    // Generate an inner div which shows the current instance name
    // When clicked on, opens up a drop-down menu in-place with list of all available instances
    //  For each of these named instances, clicking on them, will apply the loadInstance() function with the appropriate file name
    //  Clicking anywhere else will close this drop down

    // Retrieve list, and put it into var
    fetch('./data/instances.json').then(res => {return res.json();}).then(insts => {
        _instances = insts;
        loadInstanceList(insts)
    }
    ).catch((error) => { console.log(error) })
}

function test() {
    // console.log(_party)
    // addMember('paladin')
    // console.log(_party)
    // addMember('rogue')
    console.log(_party)
    // loadInstance("test.json")
    
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
    generateInstanceList()
    updateDisplay()

    // document.getElementById("scroll-left").onclick = function() { moveStart(-1) }
    document.getElementById("scroll-start").onclick = function() { setStart(0); resetSeen() }
    document.getElementById("scroll-left").onmousedown = (function() { moveStart(-1) })
    document.getElementById("scroll-right").onclick = function() { moveStart(1) }
    document.getElementById("zoom-less").onclick = function() { moveSeen(10) }
    document.getElementById("zoom-more").onclick = function() { moveSeen(-10) }
    document.getElementById("cursor-reset").onclick = function() { setCursor(0) }
    document.getElementById("cursor-left").onclick = function() { moveCursor(-1) }
    document.getElementById("cursor-right").onclick = function() { moveCursor(1) }
    test()
}

// Must be done like this so it works 
fetch("./data/jobs.json").then(res => {return res.json();}).then(jobs => 
    fetch("./data/mitigation.json").then(res => {return res.json()}).then(mits => start(jobs, mits))
).catch(doError())
