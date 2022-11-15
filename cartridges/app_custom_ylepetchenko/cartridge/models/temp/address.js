'use strict';

var base = module.superModule;

/**
 * creates a plain object that contains address information
 * @param {dw.order.OrderAddress} addressObject - User's address
 * @returns {Object} an object that contains information about the users address
 */

 function address(addressObject) {
    base.call(this, addressObject);

    this.address.addressType = addressObject.custom.addressType;
}

module.exports = address;