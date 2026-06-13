const fs = require("fs");
const path = require("path");
const { getOption } = require("./configfunctions");
const { getBaseChastity } = require("./chastityfunctions");

// Imports each toy in ./toys and makes them accessible as objects
// in process.toyslist mapped to their respective ids.
// Toys are constructed as default -> class -> specific toy, overwriting in that order.
function setUpToys() {
    let toysfunctionsroot = path.join(__dirname, "..", "toys");
    let newtoyref = require(`${toysfunctionsroot}/defaulttoy.js`);
    let toytypes = fs.readdirSync(toysfunctionsroot)
    toytypes.forEach((foldertype) => {
        if (foldertype != "defaulttoy.js") {
            let toysinfolderpath = path.join(toysfunctionsroot, foldertype);
            let toysinfolder = fs.readdirSync(toysinfolderpath);
            // Find and setup the toy type defaults
            let toydefaults = require(`${toysinfolderpath}/default.js`);
            let toydefaultoverrides = Object.keys(toydefaults)
            toysinfolder.forEach((t) => {
                if (t != "default.js") {
                    let newtoy = new newtoyref.Toy(); // Instantiate a copy of the Toy object.
                    // Overwrite with the toy type defaults, if specified.
                    toydefaultoverrides.forEach((override) => {
                        newtoy[override] = toydefaults[override]
                    })
                    // Overwrite with specific toy's values, if specified. 
                    let specifictoy = require(`${toysinfolderpath}/${t}`);
                    let specifictoyoverrides = Object.keys(specifictoy);
                    specifictoyoverrides.forEach((specificover) => {
                        newtoy[specificover] = specifictoy[specificover]
                    })
                    if (process.toytypes == undefined) { process.toytypes = {} };
                    // Push to toytypes for reference by toy functions
                    process.toytypes[t.replace(".js", "")] = newtoy;
                    // Push to autocompletes system for reference in /toy and /untoy
                    if (process.autocompletes == undefined) { process.autocompletes = {} }
                    if (process.autocompletes.toys == undefined) { process.autocompletes.toys = [] }
                    process.autocompletes.toys.push({ name: newtoy.toyname, value: t.replace(".js", "") })
                }
            })
        }
    })
}

function assignToy (user, keyholder, intensity, toytype = "vibe_bullet", origbinder) {
    let vibe = process.toytypes[toytype];
    if (!vibe) { return "NoToy" }
    if ((getOption(user, "arousalsystem") == 0) && (vibe.isArousing())) {
        return "NoArousal"; // Do not add a toy that can increase arousal, thats bad. 
    }
    if (process.toys == undefined) { process.toys = {} }
    if (process.toys[user] == undefined) { process.toys[user] = [] }
    let toy = process.toys[user].find((toy) => toy.type == toytype)
    console.log(process.toys[user])
    // Toy already exists, modify it to the new intensity, if allowed. 
    if (toy) {
        if (vibe.canModify({ userID: user, keyholderID: keyholder ?? user })) {
            if (vibe.blocker({ userID: user }) && getBaseChastity(vibe.blocker({ userID: user }).chastitytype)) {
                getBaseChastity(vibe.blocker({ userID: user }).chastitytype).onToyChange({ userID: user, keyholderID: keyholder ?? user, currentToys: process.toys[user], newToy: { type: toytype, intensity: intensity, origbinder: origbinder }, action: "modify" })
            } 
            toy.intensity = intensity
            if (process.readytosave == undefined) {
                process.readytosave = {};
            }
            process.readytosave.toys = true;
            return "Success"
        }
        else {
            return "NoModify";
        }
    }
    // Toy does not exist, add it! 
    else {
        if (vibe.canEquip({ userID: user, keyholderID: keyholder ?? user })) {
            if (vibe.blocker({ userID: user }) && getBaseChastity(vibe.blocker({ userID: user }).chastitytype)) {
                getBaseChastity(vibe.blocker({ userID: user }).chastitytype).onToyChange({ userID: user, keyholderID: keyholder ?? user, currentToys: process.toys[user], newToy: { type: toytype, intensity: intensity, origbinder: origbinder }, action: "add" })
            } 
            process.toys[user].push({
                type: toytype,
                intensity: intensity,
                origbinder: origbinder
            })
            vibe.onEquip({ userID: user, intensity: intensity })
            if (process.readytosave == undefined) {
                process.readytosave = {};
            }
            process.readytosave.toys = true;
            return "Success"
        }
        else {
            return "NoEquip"
        }
    }
}

function removeToy(user, keyholder, toytype) {
    if (process.toys == undefined) { process.toys = {} }
    if (process.toys[user] == undefined) { process.toys[user] = [] }
    let index = process.toys[user].findIndex((toy) => toy.type == toytype)
    if (index > -1) {
        let vibe = process.toytypes[toytype];
        if (vibe && vibe.blocker({ userID: user }) && getBaseChastity(vibe.blocker({ userID: user }).chastitytype)) {
            getBaseChastity(vibe.blocker({ userID: user }).chastitytype).onToyChange({ userID: user, keyholderID: keyholder ?? user, currentToys: process.toys[user], newToy: { type: toytype, intensity: vibe.intensity, origbinder: vibe.origbinder }, action: "remove"})
        } 
        if (vibe && vibe.onUnequip) {
            vibe.onUnequip({ userID: user });
        }
        process.toys[user].splice(index, 1);
    }
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.toys = true;
}

exports.setUpToys = setUpToys;

exports.canPlaceToy = canPlaceToy;
exports.canRemoveToy = canRemoveToy;
exports.assignToy = assignToy;
exports.removeToy = removeToy;