
const parsers = require('../lib/parser');
const contexts = require('../lib/context');

function evaluate(text, value, test, context) {
    const parser = parsers.createParser(text);
    
    const result = parser.parse('Expression').value.evaluate(context);
    
    test.equal(parser.parse('Expression'), null);
    
    test.ok(result);
    test.strictEqual(result, value);
    test.strictEqual(context.getLocalValue('a'), value);
}

exports['assign values to variable'] = function (test) {
    const context = contexts.createContext();
    
    context.defineLocalValue('a', 0, { mutable: true });
    evaluate('a = 1', 1, test, context);
    evaluate('a = "foo"', "foo", test, context);
};

exports['assign arithmetic expressions to variable'] = function (test) {
    const context = contexts.createContext();
    
    context.defineLocalValue('a', 0, { mutable: true });
    evaluate('a = 1+2', 3, test, context);
    evaluate('a = 355/113', 355/113, test, context);
};

