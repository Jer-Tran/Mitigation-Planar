var _mits

class Mitigation {
    constructor(name, dispalyName, icon, phys, magic, heal, shield) {
        this.name = name
        this.displayName = displayName
        this.icon = icon
        this.phys = phys
        this.magic = magic
        this.heal = heal
        this.shield = shield
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

export function createMiti(name) {
    for (let i in _mits) {
        if (_mits[i].name == name) {
            // let j = _mits[i]
            var x = new Mitigation("reprisal", "/bar.ico", 0.5, 0.5)
            return x
        }
    }

    // The file will contain job name, its role, link to their job icon, and their personal job mits
    // return new Job(name, "bar", "/foo.ico", [new Mitigation("reprisal", "/bar.ico", 0.5, 0.5)])
    throw ("Unable to find job named: " + name)
}

export function loadMits(mits) {
    _mits = mits["mitigation"] // Changing to a dictionary is a good idea down the line
    console.log(_mits)
}