const { getOption } = require("../../functions/configfunctions");

// Successful headpats will recharge the battery on the recipient's vibe by 5%. Each minute drains 2%. 
function headpatfunction(recipient, data) {
    if (data.returnedobject.hit) {
        setUserVar(recipient, "headpatslutgag", Date.now() + (300000 * getOption(recipient, "headpatrestraintpotency")));
    }
}

// Update battery
async function tick(userid, data) {
    if (getUserVar(userid, "headpatslutgag") && (getUserVar(userid, "headpatslutgag") < Date.now())) {
        setUserVar(userid, "headpatslutgag", undefined);
    }
}

exports.tick = tick;
exports.headpatfunction = headpatfunction;