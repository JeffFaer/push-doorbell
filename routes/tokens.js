var tokens = require('../tokens');
var express = require('express');
var router = express.Router();

router.post('/add_token', function(req, res) {
    tokens.addToken(req.body.token);
});
router.post('/remove_token', function(req, res) {
    tokens.removeToken(req.body.token);
});
router.get('/list_tokens', function(req, res) {
    var str = '';
    for (var token of tokens.getTokens()) {
        str += token + '\n';
    }

    res.send(str);
});

module.exports = router;
