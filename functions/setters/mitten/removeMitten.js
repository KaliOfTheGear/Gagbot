const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Removes mittens from the user.
 * 
 * - (user id) userID - The person wearing the mittens
 * ---
 * ##### *No return value*
 **********/
function deleteMitten(userID) {
    traceFirstParam(arguments[0]);
	if (process.mitten == undefined) {
		process.mitten = {};
	}
	delete process.mitten[userID];
	markForSave("mitten");
};

exports.deleteMitten = deleteMitten;
exports.removeMitten = deleteMitten;