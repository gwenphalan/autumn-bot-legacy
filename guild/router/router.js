const express = require('express');
const bodyParser = require('body-parser');
const Cache = require('../modules/cache/cache')
const { catchAsync } = require('../../utils.js')

var router = express.Router();
router.use(bodyParser.urlencoded({
  extended: false
}));
router.use(bodyParser.json());

router.post('/:guildID/:action', catchAsync(async function (req, res) {
    const body = req.body;

    if(req.params.action === "updateVerify")
    {
      Cache.webhookVerify(req.params.guildID, body);
    }
    else if(req.params.action === "updateMod")
    {
      Cache.webhookMod(req.params.guildID, body);
    }
    else if(req.params.action === "updateApps")
    {
      Cache.webhookApps(req.params.guildID, body)
    }
    else if(req.params.action === "addGuild")
    {
      Cache.webhookAddGuild(req.params.guildID)
    }
    else if(req.params.action === "deleteGuild")
    {
      Cache.webhookDeleteGuild(req.params.guildID)
    }
    else if(req.params.action === "addProfile")
    {
      Cache.webhookAddProfile(req.params.guildID, body)
    }
    else if(req.params.action === "deleteProfile")
    {
      Cache.webhookDeleteProfile(req.params.guildID)
    }

    res.send("Webhook Recieved");
}))

module.exports = router;