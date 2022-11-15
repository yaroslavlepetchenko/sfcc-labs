'use strict';

var base = module.superModule;
/**
 * Account class that represents the current customer's profile dashboard
 * @param {Object} currentCustomer - Current customer
 * @param {Object} addressModel - The current customer's preferred address
 * @param {Object} orderModel - The current customer's order history
 * @constructor
 */
function account(currentCustomer, addressModel, orderModel) {
    base.call(this, currentCustomer, addressModel, orderModel);

    if(currentCustomer.profile){
        this.profile.hobby = currentCustomer.raw.profile.custom.hobby;
        this.profile.petname = currentCustomer.raw.profile.custom.petname;
    }
}

account.getCustomerPaymentInstruments = base.getCustomerPaymentInstruments;


module.exports = account;
