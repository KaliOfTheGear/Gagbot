const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Removes a corset from a user
 * 
 * - (user id) user - The user wearing the corset
 * ---
 * ##### *No return value*
 ********/
function removeCorset(user) {
    traceFirstParam(arguments[0]);
	if (process.corset == undefined) process.corset = {};
	delete process.corset[user];
	markForSave("corset");
};

exports.removeCorset = removeCorset;