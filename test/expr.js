
var parsers = require('../lib/parser');
var contexts = require('../lib/context');

function evaluate(text) {
    var parser = parsers.createParser(text);
    var context = contexts.createContext();
    return parser.parse('Expression').value.evaluate(context);
}

exports['evaluate integers'] = function (test) {
    test.equal(evaluate('1'), 1);
    test.equal(evaluate('42'), 42);
};

exports['evaluate strings'] = function (test) {
    test.equal(evaluate('"foo"'), "foo");
    test.equal(evaluate('"bar"'), "bar");
};

exports['evaluate booleans'] = function (test) {
    test.strictEqual(evaluate('true'), true);
    test.strictEqual(evaluate('false'), false);
};
