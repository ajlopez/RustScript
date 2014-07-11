
var parsers = require('../lib/parser'),
    rustscript = require('..'),
    contexts = require('../lib/context');

function evaluate(text, context, test) {
    var parser = parsers.createParser(text);
    var expr = parser.parse('Expression');
    var result = expr.value.evaluate(context);
    
    if (test)
        test.equal(parser.parse('Expression'), null);
        
    return result;
};

exports['simple match'] = function (test) {
    var context = rustscript.createContext();
    context.defineLocalValue('a', 0, { mutable: true });
    var result = evaluate('match 1 { 1 => "one", 2 => "two" }', context, test);
    test.equal(result, 'one');
};

