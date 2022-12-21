'use strict'

function makeEmailTemplate(email, context) {
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');

    var template = 'product/components/notificationTemplate';
    var emailObj = {
        to: email,
        subject: 'Product you subscribed to is available again!'
    }
    emailHelpers.sendEmail(emailObj, template, context);
    return null;
}

function checkAvailability(listItem) {
    var productMgr = require('dw/catalog/ProductMgr');
    var URLUtils = require('dw/web/URLUtils');
    var collections = require('*/cartridge/scripts/util/collections');

        var availability;
        var obj = JSON.parse(listItem.custom.info);
        var email;
        for(var key in obj) {
            email = obj[key];
            var split = key.split('_');
            var prodId = split[0];
            var size = '0' + split[1];
            var product = productMgr.getProduct(prodId);
            var variationId;
            collections.forEach(product.variants, function (variation) {
                if(variation.custom.size == size) {
                    variationId = variation.ID;
                }
            }, this);
            var varProd = productMgr.getProduct(variationId);
            availability = varProd.availabilityModel.inStock;
        }

        var prodUrl = URLUtils.url('Product-Show', 'pid', varProd.ID).relative().toString();
        return {
            availability: availability,
            email: email,
            product: varProd,
            url: prodUrl
        }
    }

function start(args){
    var Status = require('dw/system/Status');
    var customObjectMgr = require('dw/object/CustomObjectMgr');

    var customObjects = customObjectMgr.getAllCustomObjects('notifyMe');
    var customObjectsList = customObjects.asList();

    for(var i=0; i<customObjectsList.length; i++) {
        var obj = checkAvailability(customObjectsList[i]);
        var context = obj.product;
        if(obj.availability) {
            var test = makeEmailTemplate(obj.email, context);
        }
    }

    return Status(Status.OK);
}

module.exports = {
    start: start
};