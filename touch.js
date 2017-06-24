var debug = require('debug')('push-doorbell:touch');
var MPR121 = require('adafruit-mpr121');
var config = require('./config/config');
var sendPushNotifications = require('./push');
var sendEmails = require('./emails');

var lastMessage = null;
var mpr121 = new MPR121(0x5A, 1);
mpr121.setThresholds(config.thresholdTouch, config.thresholdRelease)
    .then(function() {
        mpr121.on('touch', function(pin) {
            debug(`Touch on ${pin}`);

            var currentTime = new Date().getTime();
            if (lastMessage == null
                    || currentTime - lastMessage > config.notificationWait) {
                lastMessage = currentTime;
                sendPushNotifications();
                sendEmails();
            } else {
                var timeUntilMessage = config.notificationWait -
                    (currentTime - lastMessage);
                debug(`${timeUntilMessage} ms until next notification`);
            }
        });
    });


module.exports = mpr121;
