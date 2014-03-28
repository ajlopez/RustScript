
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
    context.defineLocalValue('a', 1, { mutable: true });
    execute('while a <= 10 { a = a + 1 }', context, test);
    test.equal(context.getLocalValue('a'), 11);
};

exports['simple while with break'] = function (test) {
    var context = contexts.createContext();
    context.defineLocalValue('a', 1, { mutable: true });
    execute('while a <= 10 { a = a + 1; if a == 5 { break; } }', context, test);
    test.equal(context.getLocalValue('a'), 5);
};

exports['simple while with continue'] = function (test) {
    var context = contexts.createContext();
    context.defineLocalValue('a', 1, { mutable: true });
    context.defineLocalValue('b', 0, { mutable: true });
    execute('while a <= 10 { if a == 5 { a = a + 1; continue; } b = b + a; a = a + 1; }', context, test);
    test.equal(context.getLocalValue('a'), 11);
    test.equal(context.getLocalValue('b'), 50);
};
