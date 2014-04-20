
var parsers = require('../lib/parser'),
    rustscript = require('..'),
    contexts = require('../lib/context');

function execute(text, context, test) {
    var parser = parsers.createParser(text);
    var expr = parser.parse('Expression');
    expr.value.evaluate(context);
    
    if (test)
        test.equal(parser.parse('Expression'), null);
};

exports['simple for'] = function (test) {
    var context = rustscript.createContext();
    context.defineLocalValue('a', 0, { mutable: true });
    execute('for n in range(1, 4) { a = a + n }', context, test);
    test.equal(context.getLocalValue('a'), 10);
};

