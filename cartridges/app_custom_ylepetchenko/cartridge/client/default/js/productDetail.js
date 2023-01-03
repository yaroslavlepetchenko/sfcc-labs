'use strict';

var processInclude = require('./util');

$(document).ready(function () {
    //processInclude(require('./selectNotAvailableVariant'));
    processInclude(require('./product/detail'));
    processInclude(require('./product/wishlist'));
});
