const fs = require("fs");

function setUserVar(user, key, value) {
	if (process.usercontext == undefined) {
		process.usercontext = {};
	}
	if (process.usercontext[user] == undefined) {
		process.usercontext[user] = {};
	}
	process.usercontext[user][key] = value;
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.usercontext = true;
}

exports.setUserVar = setUserVar;