'use strict';

module.exports = {
    selectUnselectable: function() {
        console.log('custom shit');
        $('.unavailable').on('click', function() {
            console.log('aha');
        });
    }
};