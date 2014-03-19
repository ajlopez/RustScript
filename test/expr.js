
var parsers = require('../lib/parser');
var contexts = require('../lib/context');

function evaluate(text, test) {
    var parser = parsers.createParser(text);
    var context = contexts.createContext();
    var result = parser.parse('Expression').value.evaluate(context);
    
    if (test) {
        test.equal(parser.next(), null);
        test.equal(parser.parse('Expression'), null);
    }
        
    return result;
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

exports['evaluate simple if'] = function (test) {
    test.equal(evaluate('if true { 42 }'), 42);
    test.equal(evaluate('if false { 42 }'), null);
    test.equal(evaluate('if true { 42; }'), null);
};

exports['evaluate simple if with else'] = function (test) {
    test.equal(evaluate('if true { 42 } else { 1 }', test), 42);
    test.equal(evaluate('if false { 42 } else { 1 }', test), 1);
    test.equal(evaluate('if true { 42; } else { 1; }', test), null);
};

exports['evaluate simple if with else if'] = function (test) {
    test.equal(evaluate('if true { 42 } else if true { 1 }', test), 42);
    test.equal(evaluate('if false { 42 } else if true { 1 }', test), 1);
    test.equal(evaluate('if true { 42; } else if false { 1; }', test), null);
};

