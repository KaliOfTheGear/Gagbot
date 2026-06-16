const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getCollar } = require("./getCollar");

/*********
 * Gets a list of users with secondary key access to the collaruser.
 * 
 * - (user id) collaruser - The User ID wearing the collar
 * ---
 * ##### Returns an array of user IDs with secondary access to this collar.
 *********/
function getClonedCollarKey(collaruser) {
    traceFirstParam(arguments[0]);
	return getCollar(collaruser)?.clonedKeyholders ?? [];
}

exports.getClonedCollarKey = getClonedCollarKey;