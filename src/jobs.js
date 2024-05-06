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
        for (i in this.mits) {
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
        for (i in this.mits) {
            x.appendChild(this.mits[i].getIcon())
        }
        return x
    }
}

function createJob(name) {
    // Read job data from a file, then create job instance using data
    // The file will contain job name, its role, link to their job icon, and their personal job mits
    return new Job(name, "bar", "/foo.ico", [new Mitigation("reprisal", "/bar.ico", 0.5, 0.5)])
}

function displayParty(party) {
    plist = document.getElementById("party")
    plist.innerHTML = "";
    for (i in party) {
        // Create a div/something for each member
        member = document.createElement("div")
        member.innerText = party[i].toString()
        plist.appendChild(member)
        plist.appendChild(party[i].getIcon())
        plist.appendChild(party[i].getMitiIcons())
        
        console.log(party[i])
        // Fill the container
        // Insert it to the div at the end
    }
}

function test() {
    party = []
    party.push(createJob('paladin'))
    party.push(createJob('rogue'))

    displayParty(party)
}

test()
