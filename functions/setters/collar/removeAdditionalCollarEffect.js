const { getCollar } = require("../../getters/collar/getCollar");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*******
 * Removes an additional Collar effect from the user's collar, if they are wearing a collar. 
 * 
 * - (user id) user - The user wearing the collar.
 * - (string) type - The collar effect to remove
 * ---
 * ##### *No return value*
 *******/
function removeAdditionalCollarEffect(user, type) {
    traceFirstParam(arguments[0]);
    try {
        if (getCollar(user)) {
            if (getCollar(user).additionalcollars && getCollar(user).additionalcollars.includes(type)) {
                getCollar(user).additionalcollars.splice(getCollar(user).additionalcollars.indexOf(type), 1);
            }
            if (getCollar(user).additionalcollars && getCollar(user).additionalcollars.length == 0) {
                delete getCollar(user).additionalcollars;
            }
            markForSave("collar");
        }
    }
    catch (err) {
        console.log(err)
    }
}

exports.removeAdditionalCollarEffect = removeAdditionalCollarEffect;