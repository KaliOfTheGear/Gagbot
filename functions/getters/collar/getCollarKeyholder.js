const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getCollar } = require("./getCollar");

/**********
 * Gets the primary keyholder for a person's collar.
 * 
 * - (user id) user - The User ID to get the collar for
 * ---
 * ##### Returns a string with the user ID of the primary keyholder for the user's collar.
 **********/
function getCollarKeyholder(user) {
    traceFirstParam(arguments[0]);
	return getCollar(user)?.keyholder;
}

exports.getCollarKeyholder = getCollarKeyholder;