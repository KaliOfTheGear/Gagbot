const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**************
 * Adds a wearable clothing item to a user. 
 * 
 * - (user id) user - The user to wear the clothing
 * - (string) wearable - The specific wearable type
 * ---
 * ##### *No return value*
 **************/
function assignWearable(user, wearable) {
    traceFirstParam(arguments[0]);
    if (process.wearable == undefined) {
		process.wearable = {};
	}
	if (process.wearable[user]) {
		process.wearable[user].wornwearable.push(wearable);
	} else {
		process.wearable[user] = { wornwearable: [wearable] };
	}
	markForSave("wearable");
};

exports.assignWearable = assignWearable;