var config = {
    'apiKey': '',
    'authDomain': 'project.firebaseapp.com',
    'databaseURL': 'https://project.firebaseio.com',
    'projectId': 'project',
    'storageBucket': 'project.appspot.com',
    'messagingSenderId': ''
}

if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = config;
} else {
    firebaseProjectConfig = config;
}
