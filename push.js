var debug = require('debug')('push-doorbell:push');
var config = require('./config/config');
var tokens = require('./tokens');

var admin = require('firebase-admin');
var messaging = admin.messaging();

var payload = {
    data: require('./config/notification')
};
var options = {
    collapseKey: 'message',
    priority: 'high',
    timeToLive: config.notificationWait
}

module.exports = function() {
    var devices = tokens.getTokens();
    if (devices.length == 0) {
        debug('No tokens.');
        return;
    }

    debug('Sending notification.');
    messaging.sendToDevice(devices, payload, options)
        .then(function() {
            debug("Sent notification.");
        })
        .catch(function(e) {
            debug("Error while sending message.", e);
        });
};
