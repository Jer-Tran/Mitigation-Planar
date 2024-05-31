// import jobs from './jobs.json' assert { type: "json" };
import { addMember } from "./main.js";
import { createMiti } from "./mitigation.js";

var _jobs

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

    getMits() {
        return this.mits
    }

    getNumActiveMits() {
        return this.mits.length
    }
}

function createMitList(mits) {
    let list = []
    console.log("mits are: " + mits)
    for (let i in mits) {
        try {
            let m = createMiti(mits[i])
            list.push(m)
        }
        catch {
            continue
        }
    }
    return list
}

export function createJob(name) {
    for (let i in _jobs) {
        if (_jobs[i].name == name) {
            let j = _jobs[i]
            let m = createMitList(j.mits)
            // Something to create mits list
            // Down the line, potentially be able to get reprisal, feint, etc using role and join with above list
            var x = new Job(j.name, j.role, j.icon, m)
            return x
        }
    }

    throw ("Unable to find job named: " + name)
}

export function displayJobs() {
    let jlist = document.getElementById("jobs")
    jlist.innerHTML = ""
    // TODO: Split into roles, solely for front-end visuals
    for (let i in _jobs) {
        let el = document.createElement("div")
        el.onclick = function() { addMember(_jobs[i].name) }
        let im = document.createElement("img")
        im.src = _jobs[i].icon
        el.appendChild(im)
        jlist.appendChild(el)
    }
}

export function loadJobs(jobs) {
    _jobs = jobs["jobs"] // Changing to a dictionary is a good idea down the line
    // console.log(_jobs)
}
