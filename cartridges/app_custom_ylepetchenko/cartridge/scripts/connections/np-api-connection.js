var localServiceRegistry = require('dw/svc/LocalServiceRegistry');
var service = require('dw/svc/Service');
var httpClient = require('dw/net/HTTPClient');

var npConnection = {
    getService: function() {
        var service = LocalServiceRegistry.createService('app_custom_ylepetchenko.http.warehouse.get' , {
            createRequest: function(svc, args) {
                svc.setRequestMethod("GET");

                if (args) {
                    svc.addHeader('Content-Type', 'text/xml;charset=UTF-8');
                    return args;
                }

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
            },
            makeCall: function() {
                var client = new httpClient();
                client.open('GET', );
            }
        });

        return service;

    }
}

module.exports.npConnection = npConnection;