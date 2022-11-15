'use strict';

var processInclude = require('./util');

$(document).ready(function () {
    console.log('here');
    processInclude(require('./addressBook/addressBook'));
});
