var debug = require('debug')('push-doorbell:touch')
var MPR121 = require('adafruit-mpr121');
var tokens = require('./tokens');

var admin = require('firebase-admin');
var messaging = admin.messaging();

var config = require('./config/config')
var payload = {
    data: require('./config/notification')
};
var options = {
    collapseKey: 'message',
    priority: 'high',
    timeToLive: config.notificationWait
}

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport(config.smtp);
var email = config.emails.length == 0 ? null : {
    to: config.emails.join(', '),
    subject: payload.data.title,
    text: payload.data.body
};

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
                doPushNotifications();
                sendEmails();
            } else {
                var timeUntilMessage = config.notificationWait -
                    (currentTime - lastMessage);
                debug(`${timeUntilMessage} ms until next notification`);
            }
        });
    });

function doPushNotifications() {
    var devices = tokens.getTokens();
    if (devices.length == 0) {
        debug('No tokens.');
        return;
    }

    debug('Sending notification.');
    messaging.sendToDevice(devices, payload, options)
        .catch(function(e) {
            debug("Error while sending message.", e);
        });
}

function sendEmails() {
    if (!email) {
        debug('No emails.');
        return;
    }

    debug('Sending emails.');
    transporter.sendMail(email, function(err, info) {
        if (err) {
            debug("Error sending email:", err);
        }

        debug("Sent email:", info);
    });
}

module.exports = mpr121;
