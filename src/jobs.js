// import jobs from './jobs.json' assert { type: "json" };

var _jobs
var _party = []
var _partySize = 8

class Mitigation {
    constructor(name, icon, phys, magic) {
        this.name = name;
        this.icon = icon;
        this.phys = phys;
        this.magic = magic;
    }

    toString() {
        return this.name + " " + this.icon
    }

    getIcon() {
        let img = document.createElement("img")
        img.src = this.icon
        img.alt = this.icon
        return img
    }
}

class Job {
    constructor(name, role, icon, mits) {
        this.name = name;
        this.role = role;
        this.icon = icon;
        this.mits = mits;
        // If role mits, add to the list
    }

    toString() {
        var m = ""
        for (let i in this.mits) {
            m = m + this.mits[i].toString()
        }
        return this.name + " " + this.role + " " + this.icon + " mits: [" + m + "]"
    }

    getIcon() {
        let div = document.createElement("div")
        let img = document.createElement("img")
        img.src = this.icon
        img.alt = this.icon
        div.appendChild(img)
        return div
    }

    getMitiIcons() {
        let x = document.createElement("div")
        for (let i in this.mits) {
            x.appendChild(this.mits[i].getIcon())
        }
        return x
    }
}

function createJob(name) {
    // A check for party size
    if (_party.length >= _partySize) {
        console.log("party at max size")
        return
    }

    for (let i in _jobs) {
        if (_jobs[i].name == name) {
            console.log(_jobs[i])
            let j = _jobs[i]
            var x = new Job(j.name, j.role, j.icon, [new Mitigation("reprisal", "/bar.ico", 0.5, 0.5)])
            _party.push(x)
            displayParty()
            return
        }
    }

    // The file will contain job name, its role, link to their job icon, and their personal job mits
    // return new Job(name, "bar", "/foo.ico", [new Mitigation("reprisal", "/bar.ico", 0.5, 0.5)])
    console.log("Unable to find job named: " + name)
}

function resetParty() {
    _party = []
    displayParty()
}

function temp(a) {
    console.log(a)
}

function displayJobs() {
    let jlist = document.getElementById("jobs")
    jlist.innerHTML = ""
    // TODO: Split into roles
    for (let i in _jobs) {
        let el = document.createElement("div")
        el.onclick = function() { createJob(_jobs[i].name) }
        let im = document.createElement("img")
        im.src = _jobs[i].icon
        el.appendChild(im)
        jlist.appendChild(el)
    }
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

function removeMember(index) {
    if (index < 0 || index >= _party.length) {
        console.log("invalid party memeber index " + index)
        return
    }
    _party.splice(index, 1)
    displayParty()
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
}

function doError() {
    // console.log("send help")
}

function test() {
    console.log(_party)
    createJob('paladin')
    console.log(_party)
    createJob('rogue')
    console.log(_party)

    displayParty(_party)
}


function start(jobs) {
    _jobs = jobs // Changing to a dictionary is a good idea down the line
    console.log(_jobs)
    // const jobs = require('./jobs.json')
    // console.log(jobs)
    // Considering making the .then of this function be start(data)
    displayJobs()
    
    test()
}

fetch("./data/jobs.json").then(res => {return res.json();}).then(jobs => 
    start(jobs)
).catch(doError())
