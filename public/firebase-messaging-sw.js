'use strict';

importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');
importScripts('./javascripts/firebase-project-config.js');
importScripts('./javascripts/notify.js');

firebase.initializeApp({
    'messagingSenderId': firebaseProjectConfig.messagingSenderId
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('backgroundMessage');
    return maybeNotify(function() {
        return self.registration.showNotification(payload.data.title,
                payload.data);
    });
});
