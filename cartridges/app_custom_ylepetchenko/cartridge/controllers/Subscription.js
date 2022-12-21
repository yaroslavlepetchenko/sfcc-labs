'use strict';

var server = require('server');

server.post('Subscribe', function(req, res, next) {
    var customObjectMgr = require('dw/object/CustomObjectMgr');
    var Transaction = require('dw/system/Transaction');
    var info;
    var infoObj;
    if(req.body) {
        info = req.body;
    }

    Transaction.wrap(function() {
        var customObj = customObjectMgr.getCustomObject('notifyMe', info);
        if(!empty(customObj)) {
            customObj.custom.info = info;
        }
        if(empty(customObj)) {
            customObj = customObjectMgr.createCustomObject('notifyMe', info);
            customObj.custom.info = info;
        }
    });

    next();
});

module.exports = server.exports();