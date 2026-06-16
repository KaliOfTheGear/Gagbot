const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Removes a collar from a user
 * 
 * - (user id) user - The user wearing the collar
 * ---
 * ##### *No return value*
 ********/
function removeCollar(user) {
    traceFirstParam(arguments[0]);
    if (process.collar == undefined) {
		process.collar = {};
	}
	delete process.collar[user];
	markForSave("collar");
}

exports.removeCollar = removeCollar;