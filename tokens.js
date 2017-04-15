var admin = require('firebase-admin');
var tokensRef = admin.database().ref('tokens');
var debug = require('debug')('push-doorbell:tokens');

var tokens = new Set();
var ignore = new Set();

tokensRef
    .orderByValue()
    .on('child_added', function(snapshot) {
        var token = snapshot.val();
        if (tokens.has(token)) {
            ignore.add(snapshot.key);
            snapshot.ref.remove()
                .then(function() {
                    debug('Removed duplicate');
                })
                .catch(function(e) {
                    console.log('Error removing duplicate', e);
                    ignore.delete(snapshot.key);
                });
        } else {
            tokens.add(snapshot.val());
            debug('Added ->', tokens);
        }
    });
tokensRef
    .orderByValue()
    .on('child_removed', function(snapshot) {
        if (ignore.has(snapshot.key)) {
            ignore.delete(snapshot.key);
        } else {
            tokens.delete(snapshot.val());
            debug('Removed ->', tokens);
        }
    });

var methods = {}
methods.getTokens = function() {
    return [...tokens];
};

module.exports = methods;
