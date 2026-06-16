const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*******
 * Gets the protected headgear (/item protect) for the user.
 * 
 * - (user id) userID - The person with protected headgear
 * ---
 * ##### Returns an array of string item IDs designated as protected with /item protect
 *******/
function getLockedHeadgear(userID) {
    traceFirstParam(arguments[0]);
    if (process.headwear == undefined) {
		process.headwear = {};
	}
	return process.headwear[userID]?.locked ? process.headwear[userID]?.locked : [];
}

exports.getLockedHeadgear = getLockedHeadgear;