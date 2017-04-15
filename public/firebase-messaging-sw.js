'use strict';

importScripts('https://www.gstatic.com/firebasejs/3.7.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.7.8/firebase-messaging.js');
importScripts('./javascripts/firebase-project-config.js');

firebase.initializeApp({
    'messagingSenderId': firebaseProjectConfig.messagingSenderId
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    return self.registration.showNotification(payload.notification);
});
