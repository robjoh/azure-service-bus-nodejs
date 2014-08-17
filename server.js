"use strict"

var namespace = 'azure-service-bus-nodejs',
	accessKey = '[Access key for this namespace]',
	azure = require('azure');

var client = azure.createServiceBusService(namespace, accessKey);

client.listTopics(function(error, result, response) {
    if (error) {
        console.log(error);
        return;
    }

    console.log(JSON.stringify(result, null, 3));
});

