var _mits

class Mitigation {
    constructor(name, displayName, icon, duration, cooldown, phys, magic, heal, shield, regen) {
        this.name = name
        this.displayName = displayName
        this.icon = icon
        this.duration = duration
        this.cooldown = cooldown
        this.phys = phys
        this.magic = magic
        this.heal = heal
        this.shield = shield
        this.regen = regen
        this.casts = []
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

    insertCast(t) {
        // Some checks before/after cast point to remove overlapping casts
        var newCasts = []
        for (let i in this.casts) {
            let diff = Math.abs(t - this.casts[i])
            if (diff >= this.cooldown) {
                newCasts.push(this.casts[i])
            }
        }
        this.casts = newCasts

        this.casts.push(t)
    }

    removeCast(t) {
        var index = -1
        for (let i in this.casts) {
            if (this.casts[i] == t) {
                index = i
                break
            }
        }

        if (index != -1) {
            this.casts.splice(index, 1)
        }
    }
}

export function createMiti(name) {
    for (let i in _mits) {
        if (_mits[i].name == name) {
            let m = _mits[i]
            var x = new Mitigation(m.name, m.display_name, m.icon, m.duration, m.cooldown, m.phys, m.magic, m.heal, m.shield, m.regen)
            return x
        }
    }

    throw ("Unable to find mitigation named: " + name)
}

export function loadMits(mits) {
    _mits = mits["mitigation"] // Changing to a dictionary is a good idea down the line
    // console.log(_mits)
}