'use strict';

module.exports = {
    dropdownStuff: function(){
        $('dropdown-item dropdown-toggle cat').on('mouseover', function () {
            $('onClp').css('display', 'flex');
        });
    }
};