
const parsers = require('../lib/parser');
const contexts = require('../lib/context');

function execute(text, context, test) {
    const parser = parsers.createParser(text);
    const expr = parser.parse('Expression');
    
    expr.value.evaluate(context);
    
    if (test)
        test.equal(parser.parse('Expression'), null);
};

exports['simple loop with break'] = function (test) {
    const context = contexts.createContext();
    
    context.defineLocalValue('a', 1, { mutable: true });
    
    execute('loop { a = a + 1; if a == 5 { break; } }', context, test);
    
    test.equal(context.getLocalValue('a'), 5);
};

exports['simple loop with continue and break'] = function (test) {
    const context = contexts.createContext();
    context.defineLocalValue('a', 0, { mutable: true });
    context.defineLocalValue('b', 0, { mutable: true });
    
    execute('loop { a = a + 1; if a == 5 { continue; } b = b + a; if (a == 10) { break; } }', context, test);
    
    test.equal(context.getLocalValue('a'), 10);
    test.equal(context.getLocalValue('b'), 50);
};

