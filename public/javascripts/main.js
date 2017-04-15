'use-strict';

const messaging = firebase.messaging();
var isTokenSent = false;
var isPushEnabled = false;

messaging.onTokenRefresh(function() {
    messaging.getToken()
        .then(function(refreshedToken) {
            console.log('Token refreshed.');
            isTokenSent = false;
            sendTokenToServer(refreshedToken);
        })
        .catch(function(err) {
            console.log('Unable to retrieve refreshed token.', err);
        });
});
messaging.onMessage(function(payload) {
    console.log("Message received.", payload);
});

function sendTokenToServer(token) {
    if (!isTokenSent) {
        var http = new XMLHttpRequest();
        http.open('POST', '/add_token', true)
        http.setRequestHeader('Content-type',
            'application/x-www-form-urlencoded');
        http.send('token=' + encodeURI(token));
        isTokenSent = true;
    }
}

function unsubscribe() {
    console.log('Attempting to unsubscribe.')
    var pushButton = document.querySelector('.js-push-button');
    pushButton.disabled = true;

    messaging.getToken()
        .then(function(currentToken) {
            messaging.deleteToken(currentToken)
                .then(function() {
                    console.log('Unsubscribed.');
                    isTokenSent = false;
                    isPushEnabled = false;
                    pushButton.disabled = false;
                    pushButton.textContent = 'Enable Push Messages';
                })
                .catch(function(e) {
                    console.log('Error deleting token', e);
                    pushButton.disabled = false;
                });
        })
        .catch(function(e) {
            console.log("Error retrieving token.", e);
            pushButton.disabled = false;
        });
}

function subscribe() {
    console.log('Attempting to subscribe.');
    var pushButton = document.querySelector('.js-push-button');
    pushButton.disabled = true;

    messaging.requestPermission()
        .then(function() {
            console.log('Subscribed.');
            isTokenSent = false;
            isPushEnabled = true;
            pushButton.textContent = 'Disable Push Messages';
            pushButton.disabled = false;

            messaging.getToken()
                .then(function(currentToken) {
                    if (currentToken) {
                        sendTokenToServer(currentToken);
                    }
                })
                .catch(function(e) {
                    console.log('Could not retrieve token.', e);
                });
        })
        .catch(function(e) {
            console.log('Unable to subscribe to push.', e);
            pushButton.disabled = false;
            pushButton.textContent = 'Enable Push Messages';
        });
}

function initializeState() {
    console.log('initializing state');

    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.log('Notifications not supported.');
        return;
    }

    if (Notification.permission == 'denied') {
        console.log('Notifications disabled.');
        return;
    }

    if (!('PushManager' in window)) {
        console.log('Push messages not supported.');
        return;
    }

    console.log('Waiting for service worker to be ready.');
    messaging.getToken()
        .then(function(currentToken) {
            var pushButton = document.querySelector('.js-push-button');
            pushButton.disabled = false;
            if (currentToken) {
                sendTokenToServer(currentToken);
                isPushEnabled = true;
                pushButton.textContent = 'Disable Push Messages';
            }
        })
        .catch(function(e) {
            console.log('Error fetching token.', e);
        });
}

window.addEventListener('load', function() {
    var pushButton = document.querySelector('.js-push-button');
    pushButton.addEventListener('click', function() {
        if (isPushEnabled) {
            unsubscribe();
        } else {
            subscribe();
        }
    });

    initializeState();
});

