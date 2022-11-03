'use strict';

/**
 * @namespace Account
 */

var server = require('server');
var page = module.superModule;
server.extend(page);

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
server.append('SubmitRegistration', function(req, res, next){
    var viewData = res.getViewData();
    var authenticatedCustomer;
    var form = viewData.form;
    if(form && form.valid){
        viewData.hobby = form.customer.hobby.value;
        viewData.petname = form.customer.petname.value;

        this.on('route:BeforeComplete', function (_req, _res){
            var registrationForm = res.getViewData();
            var CustomerMgr = require('dw/customer/CustomerMgr');
            var Transaction = require('dw/system/Transaction');

            if(registrationForm.success && registrationForm.authenticatedCustomer){
                Transaction.wrap(function () {
                    var customersProfile = registrationForm.authenticatedCustomer.getProfile();
                    customersProfile.custom.hobby = registrationForm.hobby;
                    customersProfile.custom.petname = registrationForm.petname;
                });
            }
        })
    }
    return next();
});

server.append('EditProfile', function (req, res, next){
    var profileForm = server.forms.getForm('profile');

    profileForm.customer.hobby.value = customer.profile.custom.hobby;
    profileForm.customer.petname.value = customer.profile.custom.petname;

    next();
});

server.append('SaveProfile', function (req, res, next){
    var Transaction = require('dw/system/Transaction');
    var CustomerMgr = require('dw/customer/CustomerMgr');

    var viewData = res.getViewData();
    var profileForm = viewData.profileForm;
    if(profileForm && profileForm.valid){
        viewData.hobby = profileForm.customer.hobby.value;
        viewData.petname = profileForm.customer.petname.value;

        this.on('route:BeforeComplete', function (_req, _res){
            var formInfo = res.getViewData();
            var profile = customer.getProfile();
            var customerLogin = customer.registered;

            if(formInfo.success && customerLogin){
                Transaction.wrap(function () {
                    profile.custom.hobby = formInfo.hobby;
                    profile.custom.petname = formInfo.petname;
                });
            }
        });
    }
    return next();
});

server.append('EditPassword', function(req, res, next){
    var ContentMgr = require('dw/content/ContentMgr');
    var content = null;

    if(req.currentCustomer){
        content = ContentMgr.getContent('registeredUserResetPassword');
    } else {
        content = ContentMgr.getContent('unregisteredUserResetPassword');
    }

    res.render('account/password', { mobile: true, content: content });
    next();
});

module.exports = server.exports();
