const { markForSave } = require("../../other/markForSave");

/**********
 * Removes a gag from the user.
 * 
 * - (user id) userID - The person wearing the gag
 * - (string) specificgag - The type of gag to remove
 * - (boolean) force - If true, forcibly removes the gag even past the headgear
 * ---
 * ##### *No return value*
 **********/
function deleteGag(userID, specificgag, force = false) {
	if (process.gags == undefined) {
		process.gags = {};
	}
	// Remove all gags if none is specified.
	if (!specificgag && process.gags[serverID] && process.gags[serverID][userID]) {
        let lockedheadgears = [];
        if (process.headwear[serverID] && process.headwear[serverID][userID]) { lockedheadgears = Object.keys(process.headwear[userID]) }
        if ((lockedheadgears.length <= 1) || force) {
            // They dont have anything locked on their head, business as usual. 
            process.gags[serverID][userID].forEach((g) => {
                if (process.gagtypes[g.gagtype] && process.gagtypes[g.gagtype].onUnlock) {
                    process.gagtypes[g.gagtype].onUnlock(serverID, userID);
                }
            })
            delete process.gags[serverID][userID];
        }
        else {
            process.gags[serverID][userID].forEach((g) => {
                if (process.gagtypes[serverID] && process.gagtypes[serverID][g.gagtype] && process.gagtypes[serverID][g.gagtype].onUnlock) {
                    process.gagtypes[serverID][g.gagtype].onUnlock(userID);
                }
                if (!process.headwear[serverID][userID][`gagharness_${g.gagtype}`]) {
                    // Splice out any gags that are eligible to be removed. 
                    let loc = process.gags[serverID][userID].findIndex((f) => f.gagtype == g.gagtype);
                    process.gags[serverID][userID].splice(loc, 1);
                }
            })
        }
	} else if (process.gags[serverID] && process.gags[serverID][userID]) {
		let loc = process.gags[serverID][userID].findIndex((f) => f.gagtype == specificgag);
		if (loc > -1) {
            if (process.gagtypes[process.gags[serverID][userID][loc].gagtype] && process.gagtypes[process.gags[serverID][userID][loc].gagtype].onUnlock) {
                process.gagtypes[process.gags[serverID][userID][loc].gagtype].onUnlock({ userID: userID });
            }
			process.gags[serverID][userID].splice(loc, 1);
		}
		if (process.gags[serverID][userID].length == 0) {
			delete process.gags[serverID][userID];
		}
	}
	markForSave("gags");
};

exports.deleteGag = deleteGag;
exports.removeGag = deleteGag;