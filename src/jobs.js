class Mitigation {
    constructor(name, icon, phys, magic) {
        this.name = name;
        this.icon = icon;
        this.phys = phys;
        this.magic = magic;
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
}

function createJob(name) {
    // Read job data from a file, then create job instance using data
    // The file will contain job name, its role, link to their job icon, and their personal job mits
    return new Job("foo", "bar", "/foo.ico", [])
}

function test() {
    pty = []
    pty.push(createJob('foobar'))

    console.log(pty)
}

test()
