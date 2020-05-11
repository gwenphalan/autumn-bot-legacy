const axios = require('axios');

class Webhook
{
  static update(action, guildID, obj)
  {
    const validActions = ["updateVerify", "updateMod", "updateApps"];

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