
var parsers = require('../lib/parser'),
    contexts = require('../lib/context');

function execute(text, context, test) {
    var parser = parsers.createParser(text);
    var expr = parser.parse('Expression');
    expr.value.evaluate(context);
    
    if (test)
        test.equal(parser.parse('Expression'), null);
};

exports['simple while'] = function (test) {
    var context = contexts.createContext();
    context.setLocalValue('a', 1);
    execute('while a <= 10 { a = a + 1 }', context, test);
    test.equal(context.getLocalValue('a'), 11);
};

exports['simple while with break'] = function (test) {
    var context = contexts.createContext();
    context.setLocalValue('a', 1);
    execute('while a <= 10 { a = a + 1; if a == 5 { break; } }', context, test);
    test.equal(context.getLocalValue('a'), 5);
};
