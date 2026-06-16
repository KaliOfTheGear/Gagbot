const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Adds a locked clothing item on the user.
 * 
 * - (user id) userID - The person wearing the clothing
 * - (string) wearable - Wearable item ID
 * ---
 * ##### *No return value*
 **********/
function addLockedWearable(userID, wearable) {
    traceFirstParam(arguments[0]);
	if (process.wearable == undefined) {
		process.wearable = {};
	}
	if (process.wearable[userID]) {
		if (process.wearable[userID].locked == undefined) {
			process.wearable[userID].locked = [wearable];
		} else {
			process.wearable[userID].locked.push(wearable);
		}
	}
	markForSave("wearable");
};

exports.addLockedWearable = addLockedWearable;