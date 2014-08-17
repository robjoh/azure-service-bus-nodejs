"use strict"

var namespace = 'azure-service-bus-nodejs',
    accessKey = '[Access key for this namespace]',
    azure = require('azure'),
    http = require('http');

var client = azure.createServiceBusService(namespace, accessKey);

var server = http.createServer(function(httpReq, httpResp) {
    client.listTopics(function(error, result, response) {
        if (error) {
            httpResp.writeHead(500, {'Content-Type': 'application/json'});
            httpResp.write(JSON.stringify(error, null, 3));
            httpResp.end();
            return;
        }

        var topics = result.map(function(topic) {
            return {
                name: topic.TopicName,
                totalSubscriptions: topic.SubscriptionCount,
                totalSize: topic.SizeInBytes 
            };
        });

        httpResp.writeHead(200, {'Content-Type': 'application/json'});
        httpResp.write(JSON.stringify(topics, null, 3));
        httpResp.end();
    });
});

server.listen(8080);



