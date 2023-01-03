'use strict'

function go(args){
    var Status = require('dw/system/Status');

    return Status(Status.OK);
}

module.exports = {
    go: go
};