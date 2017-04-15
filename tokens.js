var tokens = new Set();

methods = {}

methods.addToken = function(token) {
    tokens.add(token);
};

methods.removeToken = function(token) {
    tokens.remove(token);
};

methods.getTokens = function() {
    return tokens.keys();
};

module.exports = methods;
