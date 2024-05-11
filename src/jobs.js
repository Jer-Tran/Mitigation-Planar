// import jobs from './jobs.json' assert { type: "json" };
import { addMember } from "./main.js";

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

export function createJob(name) {
    for (let i in _jobs) {
        if (_jobs[i].name == name) {
            let j = _jobs[i]
            var x = new Job(j.name, j.role, j.icon, [new Mitigation("reprisal", "/bar.ico", 0.5, 0.5)])
            return x
        }
    }

    // The file will contain job name, its role, link to their job icon, and their personal job mits
    // return new Job(name, "bar", "/foo.ico", [new Mitigation("reprisal", "/bar.ico", 0.5, 0.5)])
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
    console.log(_jobs)
}
