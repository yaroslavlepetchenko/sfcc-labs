'use strict';

module.exports = {
    dropdownStuff: function(){
        console.log('boom');
        $('dropdown-item dropdown-toggle cat').on('mouseover', function () {
            $('onClp').css('display', 'flex');
        });
    }
};