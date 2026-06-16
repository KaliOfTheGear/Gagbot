const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getChastityBra } = require("./getChastityBra");

/*********
 * Gets a list of users with secondary key access to the user's chastity bra.
 * 
 * - (user id) userID - The User ID wearing the collar
 * ---
 * ##### Returns an array of user IDs with secondary access to this collar.
 *********/
function getClonedChastityBraKey(userID) {
    traceFirstParam(arguments[0]);
	return getChastityBra(userID)?.clonedKeyholders ?? [];
};

exports.getClonedChastityBraKey = getClonedChastityBraKey;