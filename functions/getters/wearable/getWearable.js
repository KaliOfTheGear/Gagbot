const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Gets a list of clothing the user is currently wearing
 * 
 * - (user id) userID - The user wearing the clothing
 * ---
 * ##### Returns an array with strings of wearable item IDs
 **********/
function getWearable(userID) {
    traceFirstParam(arguments[0]);
    if (process.wearable == undefined) {
		process.wearable = {};
	}
	return process.wearable[userID]?.wornwearable ? process.wearable[userID]?.wornwearable : [];
}

exports.getWearable = getWearable;