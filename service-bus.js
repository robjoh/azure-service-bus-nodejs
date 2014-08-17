"use strict"

var azure = require('azure');

function mapTopic(topic) {
    return {
        name: topic.TopicName,
        totalSubscriptions: topic.SubscriptionCount,
        totalSize: topic.SizeInBytes 
    };
}

function mapSubscription(subscription) {
    return {
        name: subscription.SubscriptionName,
        totalMessages: subscription.MessageCount
    };
}

function createClient(namespace, accessKey) {
    var client = azure.createServiceBusService(namespace, accessKey);
    
    return {
        getTopics: function (callback) {
            client.listTopics(function(error, result, response) {
                if (error) {
                    callback(error)
                    return;
                }

                callback(null, result.map(mapTopic));
            });
        },

        getSubscriptions: function (topic, callback) {
            client.listSubscriptions(topic, function(error, result, response) {
                if (error) {
                    callback(error);
                    return;
                }

                callback(null, result.map(mapSubscription));
            });
        },

        getSubscription: function (topic, subscription, callback) {
            client.getSubscription(topic, subscription, function(error, result, response) {
                if (error) {
                    callback(error);
                    return;
                }

                callback(null, mapSubscription(result));
            });
        }
    };
}

module.exports.createClient = createClient;
