const { messageSendChannel } = require("../../functions/messagefunctions")

async function tick(userID, data) {
    // Remind them on the third infraction and reset
    if (getUserVar(userID, "politeSubSilences") > 2) {
        messageSendChannel(`<@${userID}> should speak with titles to people, such as "Miss," "Mxtress," "Sir," "-sama" and the like.`, process.recentmessages[userID])
        setUserVar(userID, "politeSubSilenceTime", undefined)
        setUserVar(userID, "politeSubSilences", undefined)
    }
    if (getUserVar(userID, "politeSubSilenceTime") < Date.now()) {
        console.log(`Clearing silence timer for ${userID}`)
        setUserVar(userID, "politeSubSilenceTime", undefined)
        setUserVar(userID, "politeSubSilences", undefined)
    }
}

exports.tick = tick;