const { getOption } = require("../functions/configfunctions");

const garbleText = (text, parent, intensity, msg) => {
	let newtextparts = text.split(" ");
	let outtext = "";
    let forbiddenwords = getOption(msg.author.id, "forbiddengagpunishwords") ?? [];
	for (let i = 0; i < newtextparts.length; i++) {
		forbiddenwords.forEach((w) => {
            if (newtextparts[i].toLowerCase() === w.toLowerCase()) {
                let forbiddenstars = `✦`;
                for (let a = 0; a < newtextparts[i].length; a++) {
                    forbiddenstars = `${forbiddenstars}✦`
                }
                newtextparts[i] = forbiddenstars
            }
        })
	}
    outtext = newtextparts.join(" ")
	return outtext;
}

exports.garbleText = garbleText;
exports.breathRecovery = (_user, intensity) => 1 - intensity / 20;

exports.choicename = "Forbidden Gag";