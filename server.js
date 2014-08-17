"use strict"

var namespace = 'azure-service-bus-nodejs',
    accessKey = '[Access key for this namespace]',
    serviceBus = require('./service-bus.js'),
    http = require('http');

var client = serviceBus.createClient(namespace, accessKey);

var server = http.createServer(function(httpReq, httpResp) {
    if (httpReq.url === '/') {
        client.getTopics(writeResult);
    } else {
        var parts = httpReq.url.split('/');
        if (parts.length === 2) {
            client.getSubscriptions(parts[1], writeResult);
        } else {
            client.getSubscription(parts[1], parts[2], writeResult);
        }
    }

    function writeResult(error, result) {
        if (error) {
            httpResp.writeHead(500, {'Content-Type': 'application/json'});
            httpResp.write(JSON.stringify(error, null, 3));
            httpResp.end();
            return;
        }

        httpResp.writeHead(200, {'Content-Type': 'application/json'});
        httpResp.write(JSON.stringify(result, null, 3));
        httpResp.end();
    }
});

server.listen(8080);



