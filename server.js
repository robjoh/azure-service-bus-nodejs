"use strict"

var namespace = 'azure-service-bus-nodejs',
    accessKey = '[Access key for this namespace]',
    azure = require('azure'),
    http = require('http');

var client = azure.createServiceBusService(namespace, accessKey);

var server = http.createServer(function(httpReq, httpResp) {
    if (httpReq.url === '/') {
        getTopics(writeResult);
    } else {
        getSubscriptions(httpReq.url.slice(1), writeResult);
    }

    function getTopics(callback) {
        client.listTopics(function(error, result, response) {
            if (error) {
                callback(error)
                return;
            }

            var topics = result.map(function(topic) {                
                return {
                    name: topic.TopicName,
                    totalSubscriptions: topic.SubscriptionCount,
                    totalSize: topic.SizeInBytes 
                };
            });

            callback(null, topics);
        });
    }
    
    function getSubscriptions(topic, callback) {
        client.listSubscriptions(topic, function(error, result, response) {
            if (error) {
                callback(error);
                return;
            }

            var subscriptions = result.map(function(subscription) {
                return {
                    name: subscription.SubscriptionName,
                    totalMessages: subscription.MessageCount
                };
            });
            
            callback(null, subscriptions);
        });
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



