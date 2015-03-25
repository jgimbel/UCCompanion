var express = require('express');
var router = express.Router();
module.exports = function() {
    require('./auth')(router);
    require('./home')(router);
    return router;
};