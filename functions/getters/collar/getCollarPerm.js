const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getCollar } = require("./getCollar");

/********
 * Returns a boolean or undefined for perms supplied to a collar. 
 * 
 * - (user id) user - The User ID to get the collar for
 * - (string) perm - The permission to check for
 * ---
 * ##### Returns a boolean if permission is allowed or not, or undefined if not specified.
 ********/
function getCollarPerm(user, perm) {
    traceFirstParam(arguments[0]);
    return (getCollar(user) ? getCollar(user)[perm] : undefined)
}

exports.getCollarPerm = getCollarPerm;