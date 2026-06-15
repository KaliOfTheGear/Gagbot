/*******
 * Get all of the gags worn by the user ID
 * 
 * - (server ID) serverID - The server this is on
 * - (user id) userID - The person wearing the gags
 * ---
 * ##### Returns an array of gag objects
 *******/
function getGags(serverID, userID) {
	if (process.gags == undefined) {
		process.gags = {};
	}
    if (process.gags[serverID] == undefined) {
        process.gags[serverID] = {};
    }
	return process.gags[serverID][userID] ?? [];
};

exports.getGags = getGags;