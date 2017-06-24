var debug = require('debug')('push-doorbell:emails');
var config = require('./config/config');
var notification = require('./config/notification');
var nodemailer = require('nodemailer');

var sendEmails = function() {
    debug('No emails.');
};

if (config.emails.length > 0) {
    var transporter = nodemailer.createTransport(config.smtp);
    var email = {
        to: config.emails.join(', '),
        subject: notification.title,
        text: notification.body
    };

    sendEmails = function() {
        debug('Sending emails.');
        transporter.sendMail(email, function(err, info) {
            if (err) {
                debug("Error sending email:", err);
            }

            debug("Sent email:", info);
        });
    };
}

module.exports = sendEmails;
