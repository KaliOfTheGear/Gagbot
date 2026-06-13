const fs = require("fs");
const path = require("path");
const https = require("https");
const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require("discord.js");

const collartypes = [
	{ name: "Latex Collar", value: "collar_latex", tags: ["latex"] },
	{ name: "Leather Collar", value: "collar_leather", tags: ["leather"] },
	{ name: "Cyber Doll Collar", value: "collar_cyberdoll" },
	{ name: "Hardlight Collar", value: "collar_hardlight" },
	{ name: "Runic Collar", value: "collar_runic" },
	{ name: "Tall Posture Collar", value: "collar_posture" },
	{ name: "Ruffled Maid Collar", value: "collar_maid" },
	{ name: "Nevermere Tracking Collar", value: "collar_nevermere", tags: ["leather"] },
	{ name: "Steel Collar", value: "collar_steel", tags: ["metal"] },
	{ name: "Kitty Collar", value: "collar_kitty" },
	{ name: "Puppy Collar", value: "collar_puppy" },
	{ name: "Inari Collar", value: "collar_inari" },
	{ name: "Livingwood Collar", value: "collar_livingwood", tags: ["living"] },
	{ name: "Sheep Collar", value: "collar_sheep" },
	{ name: "Potion Collar", value: "collar_potion" },
	{ name: "Princess Collar", value: "collar_princess" },
	{ name: "Star-cursed Collar", value: "collar_star" },
	{ name: "Moonveil Collar", value: "collar_moon" },
	{ name: "Starmetal Collar", value: "collar_starmetal", tags: ["metal"] },
    { name: "Maid Training Collar", value: "collar_maidtraining", special: true },
    { name: "Struggle Collar", value: "collar_struggle", special: true },
    { name: "Engraved Collar", value: "collarengraved", special: true },
    { name: "Collar of Headpat Vulnerability", value: "collarheadpatvuln", special: true },
    { name: "Remote-Controlled Shock Collar", value: "remoteshockcollar", special: true },
    { name: "Horny Shock Collar", value: "hornyshockcollar", special: true },
    { name: "Sponsorship Collar", value: "sponsorcollar", special: true },
    { name: "Handcuff Amulet", value: "handcuffamulet" }
];

function loadCollarTypes() {
    if (process.autocompletes == undefined) { process.autocompletes = {} }
    process.autocompletes.collar = collartypes.map((c) => {
        return { name: c.name, value: c.value }
    })
    process.collartypes = collartypes;
}

const removeCollar = (user) => {
	if (process.collar == undefined) {
		process.collar = {};
	}
	delete process.collar[user];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.collar = true;
};

// Called to prompt the wearer if it is okay to clone a key.
async function promptCloneCollarKey(user, target, clonekeyholder) {
	return new Promise(async (res, rej) => {
		let buttons = [new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)];
		let bondageaccess = `${getCollarPerm(target.id, "mitten") ? "mitten you, " : ""}${getCollarPerm(target.id, "chastity") ? "put you in chastity, " : ""}${getCollarPerm(target.id, "chastity") ? "put heavy bondage on you, " : ""}`.slice(0, -2);
		let dmchannel = await target.createDM();
		await dmchannel.send({ content: `${user} would like to give ${clonekeyholder} a copy of your collar key. Do you want to allow this?${bondageaccess.length > 0 ? `\n\n**Note: ${clonekeyholder} will have access to ${bondageaccess}.**` : ""}`, components: [new ActionRowBuilder().addComponents(...buttons)] }).then((mess) => {
			// Create a collector for up to 5 minutes
			const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

			collector.on("collect", async (i) => {
				console.log(i);
				if (i.customId == "acceptButton") {
					await mess.delete().then(() => {
						i.reply(`Confirmed - ${clonekeyholder} will receive a copied key for your collar!`);
					});
					res(true);
				} else {
					await mess.delete().then(() => {
						i.reply(`Rejected - ${clonekeyholder} will NOT receive a copied key for your collar!`);
					});
					rej(true);
				}
			});

			collector.on("end", async (collected) => {
				// timed out
				if (collected.length == 0) {
					await mess.delete().then(() => {
						i.reply(`Timed Out - ${clonekeyholder} will NOT receive a copied key for your collar!`);
					});
					rej(true);
				}
			});
		});
	});
}

// Called to prompt the wearer if it is okay to give a key.
async function promptTransferCollarKey(user, target, newKeyholder) {
	return new Promise(async (res, rej) => {
		try {
			let buttons = [new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)];
			let bondageaccess = `${getCollarPerm(target.id, "mitten") ? "mitten you, " : ""}${getCollarPerm(target.id, "chastity") ? "put you in chastity, " : ""}${getCollarPerm(target.id, "chastity") ? "put heavy bondage on you, " : ""}`.slice(0, -2);
			let dmchannel = await target.createDM();
			await dmchannel.send({ content: `${user} would like to give ${newKeyholder} your collar key. Do you want to allow this?${bondageaccess.length > 0 ? `\n\n**Note: ${newKeyholder} will have access to ${bondageaccess}.**` : ""}`, components: [new ActionRowBuilder().addComponents(...buttons)] }).then((mess) => {
				// Create a collector for up to 5 minutes
				const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

				collector.on("collect", async (i) => {
					console.log(i);
					if (i.customId == "acceptButton") {
						await mess.delete().then(() => {
							i.reply(`Confirmed - ${newKeyholder} will receive the key for your collar!`);
						});
						res(true);
					} else {
						await mess.delete().then(() => {
							i.reply(`Rejected - ${newKeyholder} will NOT receive the key for your collar!`);
						});
						rej(true);
					}
				});

				collector.on("end", async (collected) => {
					// timed out
					if (collected.length == 0) {
						await mess.delete().then(() => {
							i.reply(`Timed Out - ${newKeyholder} will NOT receive the key for your collar!`);
						});
						rej(true);
					}
				});
			});
		} catch (err) {
			console.log(`No DMs available for ${target}`);
			rej("NoDM");
		}
	});
}

// Called once we confirm the user is okay with it!
// For cloned keys, we want to allow a cloned key to do everything except
// giving the key or cloning the key. These actions should check the
// fourth param of the canAccessCollar function and set it to true
// when the action needs to REJECT cloned keys.
const cloneCollarKey = (collarUser, newKeyholder) => {
	let collar = getCollar(collarUser);
	if (!collar.clonedKeyholders) {
		collar.clonedKeyholders = [];
	}
	collar.clonedKeyholders.push(newKeyholder);
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.collar = true;
};

// Called to remove a single cloned keyholder from the list.
const revokeCollarKey = (collarUser, newKeyholder) => {
	let collar = getCollar(collarUser);
	if (!collar.clonedKeyholders) {
		collar.clonedKeyholders = [];
	}
	if (collar.clonedKeyholders.includes(newKeyholder)) {
		collar.clonedKeyholders.splice(collar.clonedKeyholders.indexOf(newKeyholder), 1);
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.collar = true;
};

// transfer keys and returns whether the transfer was successful
const transferCollarKey = (lockedUser, newKeyholder) => {
	if (process.collar == undefined) {
		process.collar = {};
	}
	if (process.collar[lockedUser]) {
		if (process.collar[lockedUser].keyholder != newKeyholder) {
			process.collar[lockedUser].keyholder = newKeyholder;
			// Erase cloned keys in this process!
			process.collar[lockedUser].clonedKeyholders = [];
			if (process.readytosave == undefined) {
				process.readytosave = {};
			}
			process.readytosave.collar = true;
			return true;
		}
	}

	return false;
};

//////// OLD CODE
const discardCollarKey = (user) => {
	if (process.collar == undefined) {
		process.collar = {};
	}
	if (process.discardedKeys == undefined) {
		process.discardedKeys = [];
	}
	if (process.collar[user]) {
		process.collar[user].keyholder = "discarded";
		process.collar[user].clonedKeyholders = [];
		process.discardedKeys.push({ restraint: "collar", wearer: user });
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.collar = true;
	process.readytosave.discardedKeys = true;
};

/////// OLD CODE
const findCollarKey = (index, newKeyholder) => {
	if (process.collar == undefined) {
		process.collar = {};
	}
	if (process.discardedKeys == undefined) {
		process.discardedKeys = [];
	}
	const collar = process.discardedKeys.splice(index, 1);
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.discardedKeys = true;
	if (collar.length < 1) return false;
	if (process.collar[collar[0].wearer]) {
		process.collar[collar[0].wearer].keyholder = newKeyholder;
		// Erase cloned keys in this process!
		process.collar[collar[0].wearer].clonedKeyholders = [];
		if (process.readytosave == undefined) {
			process.readytosave = {};
		}
		process.readytosave.collar = true;
		return true;
	}
	return false;
};

/*******
 * Adds an additional Collar effect to the user's collar, if they are wearing a collar. 
 * 
 * - (user id) user - The user wearing the collar.
 * - (string) type - The collar effect to add
 *******/
const addAdditionalCollarEffect = (user, type) => {
    try {
        if (getCollar(user)) {
            if (!process.collar[user].additionalcollars) { process.collar[user].additionalcollars = [] }
            process.collar[user].additionalcollars.push(type)
            if (process.readytosave == undefined) {
                process.readytosave = {};
            }
            process.readytosave.collar = true;
        }
    }
    catch (err) {
        console.log(err);
    }
}

/*******
 * Removes an additional Collar effect from the user's collar, if they are wearing a collar. 
 * 
 * - (user id) user - The user wearing the collar.
 * - (string) type - The collar effect to remove
 *******/
const removeAdditionalCollarEffect = (user, type) => {
    try {
        if (getCollar(user)) {
            if (process.collar[user].additionalcollars && process.collar[user].additionalcollars.includes(type)) {
                process.collar[user].additionalcollars.splice(process.collar[user].additionalcollars.indexOf(type), 1);
            }
            if (process.collar[user].additionalcollars && process.collar[user].additionalcollars.length == 0) {
                delete process.collar[user].additionalcollars;
            }
            if (process.readytosave == undefined) {
                process.readytosave = {};
            }
            process.readytosave.collar = true;
        }
    }
    catch (err) {
        console.log(err)
    }
}

exports.assignCollar = assignCollar;
exports.removeCollar = removeCollar;
exports.transferCollarKey = transferCollarKey;
exports.discardCollarKey = discardCollarKey;
exports.findCollarKey = findCollarKey;
exports.collartypes = collartypes;
exports.promptCloneCollarKey = promptCloneCollarKey;
exports.promptTransferCollarKey = promptTransferCollarKey;
exports.cloneCollarKey = cloneCollarKey;
exports.revokeCollarKey = revokeCollarKey;

exports.loadCollarTypes = loadCollarTypes;

exports.addAdditionalCollarEffect = addAdditionalCollarEffect;
exports.removeAdditionalCollarEffect = removeAdditionalCollarEffect;