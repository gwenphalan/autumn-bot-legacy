const express = require('express');
const bodyParser = require('body-parser');
const Cache = require('../modules/cache/cache')

var router = express.Router();
router.use(bodyParser.urlencoded({
  extended: false
}));
router.use(bodyParser.json());

router.post('/:guildID/:action', catchAsync(async function (req, res) {
    const body = req.body;
    const params = req.params;

    if(action === "updateVerify")
    {
      Cache.updateVerify(params.guildID, body);
    }
    else if(action === "updateMod")
    {
      Cache.updateMod(params.guildID, body);
    }
    else if(action === "updateApps")
    {
      Cache.updateApps(params.guildID, body)
    }

    res.send("Webhook Recieved");
}))

module.exports = router;