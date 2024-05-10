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

function displayParty() {
    let plist = document.getElementById("party")
    plist.innerHTML = "";
    let reset = document.createElement("div")
    reset.innerHTML = "reset button"
    reset.onclick = resetParty
    plist.appendChild(reset)
    for (let i in _party) {
        // Create a div/something for each member
        let member = document.createElement("div")
        member.innerText = _party[i].toString()
        plist.appendChild(member)
        plist.appendChild(_party[i].getIcon())
        // plist.appendChild(party[i].getMitiIcons())
        
        console.log(_party[i])
        // Fill the container
        // Insert it to the div at the end
    }
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
