var debug = require('debug')('push-doorbell:touch')
var MPR121 = require('adafruit-mpr121');
var tokens = require('./tokens');
var admin = require('firebase-admin');
var messaging = admin.messaging();
var config = require('./config/config')
var payload = {
    notification: require('./config/notification')
};
var options = {
    collapseKey: 'message',
    timeToLive: config.notificationWait
}

var lastMessage = null;
var mpr121 = new MPR121(0x5A, 1);
mpr121.on('touch', function(pin) {
    debug(`Touch on ${pin}`);

    var currentTime = new Date().getTime();
    if (lastMessage == null
            || currentTime - lastMessage > config.notificationWait) {
        debug('Sending notification.');
        lastMessage = currentTime;
        messaging.sendToDevice(tokens.getTokens(), payload, options);
    } else {
        var timeUntilMessage = config.notificationWait -
            (currentTime - lastMessage);
        debug(`${timeUntilMessage} ms until next notification`);
    }
});

module.exports = mpr121;
