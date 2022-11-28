'use strict';

/**
 * @namespace Address
 */

var server = require('server');
var page = module.superModule;
server.extend(page);

server.append('SaveAddress', function(req, res, next){

    var viewData = res.getViewData();
    var form = viewData.addressForm;
    if(form && form.valid){
        viewData.addressType = form.addressType.value;

        this.on('route:BeforeComplete', function () {
            var Transaction = require('dw/system/Transaction');
            var addressForm = res.getViewData();
            var address = null;

            if(addressForm.success){
                Transaction.wrap(function () {
                    var addressBook = customer.getProfile().getAddressBook();
                    address = addressBook.getAddress(addressForm.addressId);
                    address.custom.addressType = addressForm.addressType;
                });
            }

        });
    }

    return next();

});


module.exports = server.exports();