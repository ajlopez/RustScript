
var parsers = require('../lib/parser');

function evaluate(text) {
    var parser = parsers.createParser(text);
    var expr = parser.parse('Expression');
    return expr.value.evaluate(null);
};

exports['parse and evaluate integer'] = function (test) {
    test.equal(evaluate('42'), 42); 
};

exports['parse and evaluate add integers'] = function (test) {
    test.equal(evaluate('1+2'), 3);
};

exports['parse and evaluate substract integers'] = function (test) {
    test.equal(evaluate('1-2'), -1);
};

exports['parse and evaluate multiply integers'] = function (test) {
    test.equal(evaluate('2*3'), 6);
};

exports['parse and evaluate divide integers'] = function (test) {
    test.equal(evaluate('6/2'), 3);
};

exports['parse and evaluate simple arithmetic expression'] = function (test) {
    test.equal(evaluate('2+6/2'), 5);
};

exports['parse and evaluate simple arithmetic expression with parenthesis'] = function (test) {
    test.equal(evaluate('(2+6)/2'), 4);
};
