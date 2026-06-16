const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Set the counter for a user by name. Specify Value
 * 
 * - (user id) user - User to increment for
 * - (string) countername - ID of the counter to increment
 * - (any) value - Value to store in countername
 **********/
function statsSetCounter(user, countername, value) {
    traceFirstParam(arguments[0]);
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[user] == undefined) { process.userstats[user] = {} }
    process.userstats[user][countername] = value;
    markForSave("userstats");
}

exports.statsSetCounter = statsSetCounter;