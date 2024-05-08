// import jobs from './jobs.json' assert { type: "json" };

var _jobs

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

function createJob(party, name) {
    for (let i in _jobs) {
        if (_jobs[i].name == name) {
            console.log(_jobs[i])
            let j = _jobs[i]
            var x = new Job(j.name, j.role, j.icon, [new Mitigation("reprisal", "/bar.ico", 0.5, 0.5)])
            party.push(x)
            return
        }
    }

    // The file will contain job name, its role, link to their job icon, and their personal job mits
    // return new Job(name, "bar", "/foo.ico", [new Mitigation("reprisal", "/bar.ico", 0.5, 0.5)])
    console.log("Unable to find job named: " + name)
}

function displayParty(party) {
    let plist = document.getElementById("party")
    plist.innerHTML = "";
    for (let i in party) {
        // Create a div/something for each member
        let member = document.createElement("div")
        member.innerText = party[i].toString()
        plist.appendChild(member)
        plist.appendChild(party[i].getIcon())
        // plist.appendChild(party[i].getMitiIcons())
        
        console.log(party[i])
        // Fill the container
        // Insert it to the div at the end
    }
}

function doError() {
    // console.log("send help")
}

function test() {
    party = []
    console.log(party)
    createJob(party, 'paladin')
    console.log(party)
    createJob(party, 'rogue')
    console.log(party)

    displayParty(party)
}


function start(jobs) {
    _jobs = jobs // Changing to a dictionary is a good idea down the line
    console.log(_jobs)
    // const jobs = require('./jobs.json')
    // console.log(jobs)
    // Considering making the .then of this function be start(data)
    
    test()
}

fetch("./data/jobs.json").then(res => {return res.json();}).then(jobs => 
    start(jobs)
).catch(doError())
