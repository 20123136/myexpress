let proxy = require('./proxy');
let express = require('express');
let router = express.Router();

var info = require('config').get('Portal');
router.use('/', function (req, res) {
    proxy(req, res, info);
})

module.exports = router;
