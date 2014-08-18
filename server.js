"use strict"

var namespace = 'azure-service-bus-nodejs',
    accessKey = '[Access key for this namespace]',
    serviceBus = require('./service-bus.js'),
    http = require('http'),
    express = require('express');

var client = serviceBus.createClient(namespace, accessKey);
var app = express();

app.get('/', function(httpReq, httpResp) {
    client.getTopics(writeResult(httpResp));
});

app.get('/:topic', function(httpReq, httpResp) {
    client.getSubscriptions(httpReq.params.topic, writeResult(httpResp));
});

app.get('/:topic/:subscription', function(httpReq, httpResp) {
    client.getSubscription(httpReq.params.topic, httpReq.params.subscription, writeResult(httpResp));
});

http.createServer(app).listen(8080);

function writeResult(httpResp) {
    return function(error, result) {
        if (error) {
            httpResp.status(500).send(error);
            return;
        }

        httpResp.status(200).send(result);
    }
}