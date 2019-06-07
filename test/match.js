
const parsers = require('../lib/parser');
const rustscript = require('..');
const contexts = require('../lib/context');

function evaluate(text, context, test) {
    const parser = parsers.createParser(text);
    const expr = parser.parse('Expression');
    const result = expr.value.evaluate(context);
    
    if (test)
        test.equal(parser.parse('Expression'), null);
        
    return result;
};

exports['simple match'] = function (test) {
    const context = rustscript.createContext();
    const result = evaluate('match 1 { 1 => "one", 2 => "two" }', context, test);
    
    test.equal(result, 'one');
};

exports['match using default'] = function (test) {
    const context = rustscript.createContext();
    const result = evaluate('match 10 { 1 => "one", 2 => "two", _ => "other" }', context, test);
    
    test.equal(result, 'other');
};

