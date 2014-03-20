
var parsers = require('../lib/parser'),
    contexts = require('../lib/context');

function execute(text, context, test) {
    var parser = parsers.createParser(text);
    var expr = parser.parse('Expression');
    expr.value.evaluate(context);
    
    if (test)
        test.equal(parser.parse('Expression'), null);
};

exports['simple loop with break'] = function (test) {
    var context = contexts.createContext();
    context.setLocalValue('a', 1);
    execute('loop { a = a + 1; if a == 5 { break; } }', context, test);
    test.equal(context.getLocalValue('a'), 5);
};

exports['simple loop with continue and break'] = function (test) {
    var context = contexts.createContext();
    context.setLocalValue('a', 0);
    context.setLocalValue('b', 0);
    execute('loop { a = a + 1; if a == 5 { continue; } b = b + a; if (a == 10) { break; } }', context, test);
    test.equal(context.getLocalValue('a'), 10);
    test.equal(context.getLocalValue('b'), 50);
};