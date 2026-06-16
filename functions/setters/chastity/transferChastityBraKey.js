const { getChastityBra } = require("../../getters/chastity/getChastityBra");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Changes the primary keyholder for a user's chastity bra. Removes cloned keys.
 * 
 * - (user id) lockedUser - The person wearing the chastity bra
 * - (user id) newKeyholder - The next person to hold the key
 * ---
 * ##### Returns true if successful, false if lockedUser is not wearing a chastity bra
 ********/
function transferChastityBraKey(lockedUser, newKeyholder) {
    traceFirstParam(arguments[0]);
	if (getChastityBra(lockedUser)) {
		if (getChastityBra(lockedUser).keyholder != newKeyholder) {
			getChastityBra(lockedUser).keyholder = newKeyholder;
			getChastityBra(lockedUser).clonedKeyholders = [];
			markForSave("chastitybra");
			return true;
		}
	}

	return false;
}

exports.transferChastityBraKey = transferChastityBraKey;