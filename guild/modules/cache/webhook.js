const axios = require('axios');

class Webhook
{
  static send(action, guildID, obj)
  {
    const validActions = ["updateVerify", "updateMod", "updateApps", "addGuild", "deleteGuild", "addProfile", "deleteProfile"];

    if(!validActions.includes(action))
    {
      throw new Error('Invalid Action');
    }

    axios
        .post(`${process.env.WEBSITE_LINK}/webhook/${guildID}/${action}`, obj)
        .then(res => {
            console.log("RES: " + res.data)
        })
        .catch(error => {
            console.error(error)
        })
  }
}

module.exports = Webhook;