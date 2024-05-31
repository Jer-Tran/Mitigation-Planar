var _mits

class Mitigation {
    constructor(name, displayName, icon, duration, cooldown, phys, magic, heal, shield) {
        this.name = name
        this.displayName = displayName
        this.icon = icon
        this.duration = duration
        this.cooldown = cooldown
        this.phys = phys
        this.magic = magic
        this.heal = heal
        this.shield = shield
    }

    toString() {
        return this.name + " " + this.icon + " " + this.phys + " " + this.magic + " " + this.heal + " " + this.shield
    }

    getIcon() {
        let img = document.createElement("img")
        img.src = this.icon
        img.alt = this.displayName
        return img
    }
}

export function createMiti(name) {
    for (let i in _mits) {
        if (_mits[i].name == name) {
            let m = _mits[i]
            var x = new Mitigation(m.name, m.display_name, m.icon, m.duration, m.cooldown, m.phys, m.magic, m.heal, m.shield)
            return x
        }
    }

    throw ("Unable to find mitigation named: " + name)
}

export function loadMits(mits) {
    _mits = mits["mitigation"] // Changing to a dictionary is a good idea down the line
    // console.log(_mits)
}