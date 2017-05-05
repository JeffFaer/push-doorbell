'use-strict';

const messaging = firebase.messaging();
const database = firebase.database();
const tokensRef = database.ref('tokens');
var lastSentToken = null;

function updateToken(token) {
    if (!token || token === lastSentToken) {
        return;
    }

    console.log('Updating token.');

    if (lastSentToken) {
        console.log('Removing old token.');
        findToken(lastSentToken, function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                childSnapshot.ref.remove(function(e) {
                    console.log('Error while removing token.', e);
                });
            });
        });
    }

    console.log('Searching for existing token.');
    findToken(token, function(snapshot) {
        if (snapshot.hasChildren()) {
            console.log('Found existing token.');
            lastSentToken = token;
        } else {
            console.log('Adding new token.');
            tokensRef.push(token)
                .then(function() {
                    console.log('Added token.');
                    lastSentToken = token;
                })
                .catch(function(e) {
                    console.log('Error while writing token.', e);
                });
        }
    });

}

function findToken(token, action) {
    if (!token) {
        return;
    }

    tokensRef
        .orderByValue()
        .equalTo(token)
        .once('value')
        .then(action)
        .catch(function(e) {
            console.log('Error while looking up token.', e);
        });
}

messaging.onTokenRefresh(function() {
    messaging.getToken()
        .then(function(refreshedToken) {
            updateToken(refreshedToken);
        })
        .catch(function(e) {
            console.log('Unable to retrieve refreshed token.', e);
        });
});
messaging.onMessage(function(payload) {
    console.log('onMessage');
    if (Notification.permission === "granted") {
        maybeNotify(function() {
            new Notification(payload.data.title, payload.data);
        });
    }
});

window.addEventListener('load', function() {
    var statusDiv = document.querySelector('.status');
    messaging.requestPermission()
        .then(function() {
            console.log('Got permission to notify.');
            statusDiv.textContent = 'Will notify.';

            messaging.getToken()
                .then(updateToken)
                .catch(function(e) {
                    console.log('Could not retrieve token.', e);
                    statusDiv.textContent = 'Could not retrieve token.';
                });
        })
        .catch(function(e) {
            console.log('Did not get permission to notify.', e);
            statusDiv.textContent = 'Permission denied.';
        });
});
