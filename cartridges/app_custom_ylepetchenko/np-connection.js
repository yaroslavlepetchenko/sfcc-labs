/**
 *
 *    A library file for WebInterpret communication.
 *    Holds all necessary information which are used to establish a connection to a remote system
 *    It cannot be used as a pipelet.
 *
 */

var ArrayList = require('dw/util/ArrayList');
var Resource = require('dw/web/Resource');
var Logger = require('dw/system/Logger');
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var WebInterpretUtilities = require('*/cartridge/scripts/webInterpret/libWebInterpretUtilities');
var WebInterpretUtil = WebInterpretUtilities.WebInterpretUtil;

var libWebInterpretClient = {
    getService: function () {
        try {
            var service = LocalServiceRegistry.createService('webInterpret.http.ws.post', {
                createRequest: function (svc, args) {
                    // Default request method is post
                    // No need to setRequestMethod
                    if (args) {
                        svc.addHeader('Content-Type', 'text/xml;charset=UTF-8');
                        return args;
                    }
​
                    return null;
                },
                parseResponse: function (svc, client) {
                    return client.text;
                },
                filterLogMessage: function (message) {
                    return message;
                },
                getRequestLogMessage: function (serviceRequest) {
                    return serviceRequest;
                },
                getResponseLogMessage: function (serviceResponse) {
                    return serviceResponse.text;
                }
            });
            return service;
        } catch (error) {
            var errorMsg = Resource.msgf('webInterpret.error.noservice', 'webInterpret', null);
            throw new Error(errorMsg);
        }
    },
​
    getCredentials: function () {
        var service = this.getService();
​
        var configuration = service.getConfiguration();
​
        if (configuration == null || configuration.credential == null) {
            var errorMsg = Resource.msgf('webInterpret.error.nocredentials', 'webInterpret', null);
            throw new Error(errorMsg);
        }
​
        return configuration.credential;
    },
​
    getLogin: function () {
        return this.getCredentials().user;
    },
​
    getSecret: function () {
        return this.getCredentials().password;
    },
​
    getEndpoint: function () {
        return WebInterpretUtil.getCustomPrefValue('WebInterpretEndpoint');
    },
​
    getTimeout: function () {
        try {
            var serverTimeout = WebInterpretUtil.getCustomPrefValue('serverTimeout');
            // eslint-disable-next-line no-new-wrappers
            var timeoutSeconds = new Number(serverTimeout);
            return timeoutSeconds * 1000;
        } catch (ex) {
            Logger.error(Resource.msgf('webInterpret.error.timeout', 'webInterpret', null, ex));
        }
        return 0;
    },
​
    getFromCountryCode: function () {
        return WebInterpretUtil.getCustomPrefValue('WebInterpretShipFrom');
    },
​
    getProductWeightUnit: function () {
        return WebInterpretUtil.getCustomPrefValue('WIWeightUnit');
    },
​
    getProductDimensionUnit: function () {
        return WebInterpretUtil.getCustomPrefValue('WIDimensionUnit');
    },
​
    getFlatrateFlagStandard: function () {
        return WebInterpretUtil.getCustomPrefValue('WIFlatrateFlagSt');
    },
​
    getFlatrateFlagExpress: function () {
        return WebInterpretUtil.getCustomPrefValue('WIFlatrateFlagEx');
    },
​
    getSaveWebInterpretAddressOnValidateAddress: function () {
        return WebInterpretUtil.getCustomPrefValue('SaveWIAddressOnValidateAddress');
    },
​
    getTimestamp: function () {
        var currentDate = new Date();
        var timestamp = Math.round(currentDate.getTime() / 1000);
        var randomDigits = Math.round(Math.random() * 1000000);
        // eslint-disable-next-line no-new-wrappers
        var newTimestamp = new Number(timestamp + '.' + randomDigits);
​
        return (newTimestamp.toFixed(6)).toString();
    },
​
    generateSignature: function (timestamp) {
        var Mac = require('dw/crypto/Mac');
        var Encoding = require('dw/crypto/Encoding');
​
        var encryptor = new Mac(Mac.HMAC_SHA_256);
        var stringForHash = libWebInterpretClient.getLogin() + '@' + timestamp;
        var hashBytes = encryptor.digest(stringForHash, libWebInterpretClient.getSecret());
        var hashString = Encoding.toHex(hashBytes);
​
        return hashString;
    },
​
    getBasicXmlForRequest: function (app, cmd, body) {
        var StringWriter = require('dw/io/StringWriter');
        var timestamp = libWebInterpretClient.getTimestamp();
        var signature = libWebInterpretClient.generateSignature(timestamp);
​
        var result = '';
​
        var writer = new StringWriter();
​
        try {
            writer.write('<BLXREQUEST>');
​
            writer.write('<login>');
            writer.write(libWebInterpretClient.getLogin());
            writer.write('</login>');
​
            writer.write('<timestamp>');
            writer.write(timestamp);
            writer.write('</timestamp>');
​
            writer.write('<signature>');
            writer.write(signature);
            writer.write('</signature>');
​
            writer.write('<app>');
            writer.write(app);
            writer.write('</app>');
​
            writer.write('<cmd>');
            writer.write(cmd);
            writer.write('</cmd>');
​
            writer.write(body);
​
            writer.write('</BLXREQUEST>');
​
            result = writer.toString();
        } catch (ex) {
            Logger.error(Resource.msgf('webInterpret.error.createrequest', 'webInterpret', null, ex));
        } finally {
            writer.close();
        }
​
        return result;
    },
​
    // Mapped Product Attribute Names
    getProductClassFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('ProductClass');
    },
​
    getHSCodeFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('HSCode');
    },
​
    getShippingHeightFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('ShippingHeight');
    },
​
    getShippingWidthFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('ShippingWidth');
    },
​
    getShippingLengthFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('ShippingLength');
    },
​
    getShippingWeightFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('ShippingWeight');
    },
​
    getProductDescriptionFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('ProductDescription');
    },
​
    getGtinFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('GTIN');
    },
​
    getMerchantSkuFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('MerchantSKU');
    },
​
    getMerchantParentSkuFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('MerchantParentSKU');
    },
​
    getProductBrandFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('ProductBrand');
    },
​
    getCountryOfOriginFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('CountryOfOrigin');
    },
​
    getManufacturerIDFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('WIManufacturerID');
    },
​
    getProductCategoryFieldsName: function () {
        var result = new ArrayList();
        var prefValue = WebInterpretUtil.getCustomPrefValue('ProductCategory');
​
        if (prefValue == null) {
            return result;
        }
​
        var jsonValue;
​
        try {
            jsonValue = JSON.parse(prefValue);
        } catch (ex) {
            var message = Resource.msgf('webInterpret.error.jsonconversion', 'webInterpret', null, 'Product category attribute mapping');
            Logger.error(message);
            throw new Error(message);
        }
​
        for (var i = 0; i < jsonValue.length; i++) {
            result.add(jsonValue[i]);
        }
​
        return result;
    },
​
    getProductMaterialFieldsName: function () {
        var result = new ArrayList();
        var prefValue = WebInterpretUtil.getCustomPrefValue('ProductMaterial');
​
        if (prefValue == null) {
            return result;
        }
​
        var jsonValue;
​
        try {
            jsonValue = JSON.parse(prefValue);
        } catch (ex) {
            var message = Resource.msgf('webInterpret.error.jsonconversion', 'webInterpret', null, 'Product material attribute mapping');
            Logger.error(message);
            throw new Error(message);
        }
​
        for (var i = 0; i < jsonValue.length; i++) {
            result.add(jsonValue[i]);
        }
​
        return result;
    },
​
    generateRandomShippingId: function () {
        var randomDigits = Math.round(Math.random() * 1000000);
        return randomDigits.toFixed();
    },
​
    getDocumentationCodeFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('DocumentationCode');
    },
​
    getVATNumberFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('VATNumber');
    },
​
	getServicePointReferenceFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('ServicePointReference');
    },
​
    getHubCodeFieldName: function () {
        return WebInterpretUtil.getCustomPrefValue('HubCode');
    },
​
    getBlockProhibitionLevel: function () {
        return WebInterpretUtil.getCustomPrefValue('blockProhibitionLevel');
    },
​
    getWebInterpretErrorMappings: function (serviceName) {
        var mappings;
        var mappingsString = WebInterpretUtil.getCustomPrefValue('WebInterpretErrorMappings');
        if (!empty(mappingsString)) {
            try {
                mappings = JSON.parse(mappingsString);
            } catch (e) {
                Logger.error(Resource.msgf('webInterpret.error.jsonconversion', 'webInterpret', null, 'WebInterpret error mappings'));
                return null;
            }
            for (var i = 0; i < mappings.length; i++) {
                if (mappings[i].serviceName !== serviceName) {
                    // eslint-disable-next-line no-continue
                    continue;
                }
​
                return mappings[i].errorMappings;
            }
        }
​
        return null;
    }
​
};
​
module.exports.WebInterpretClient = libWebInterpretClient;