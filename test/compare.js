
var parsers = require('../lib/parser'),
    contexts = require('../lib/context');

function evaluate(text, context) {
    var parser = parsers.createParser(text);
    var expr = parser.parse('Expression');
    return expr.value.evaluate(context);
};

exports['parse and evaluate equal'] = function (test) {
    test.strictEqual(evaluate('42==42'), true); 
    test.strictEqual(evaluate('42==1'), false); 
};

exports['parse and evaluate equal using variable'] = function (test) {
    var context = contexts.createContext();
    context.defineLocalValue('a', 42);
    test.strictEqual(evaluate('a==42', context), true); 
    test.strictEqual(evaluate('a==1', context), false); 
};

exports['parse and evaluate not equal'] = function (test) {
    test.strictEqual(evaluate('42!=42'), false); 
    test.strictEqual(evaluate('42!=1'), true); 
};

exports['parse and evaluate less'] = function (test) {
    test.strictEqual(evaluate('42<43'), true); 
    test.strictEqual(evaluate('42<1'), false); 
};

exports['parse and evaluate greater'] = function (test) {
    test.strictEqual(evaluate('42>43'), false); 
    test.strictEqual(evaluate('42>1'), true); 
};

exports['parse and evaluate less or equal'] = function (test) {
    test.strictEqual(evaluate('42<=43'), true); 
    test.strictEqual(evaluate('42<=42'), true); 
    test.strictEqual(evaluate('42<=1'), false); 
};

exports['parse and evaluate greater or equal'] = function (test) {
    test.strictEqual(evaluate('43>=42'), true); 
    test.strictEqual(evaluate('42>=42'), true); 
    test.strictEqual(evaluate('1>=42'), false); 
};
