
const parsers = require('../lib/parser');
const contexts = require('../lib/context');

function evaluate(text, name, value, test) {
    const parser = parsers.createParser(text);
    const context = contexts.createContext();
    
    const result = parser.parse('Expression').value.evaluate(context);
    test.equal(parser.parse('Expression'), null);
    
    test.ok(result);
    
    if (Array.isArray(value)) {
        test.deepEqual(result, value);
        test.deepEqual(context.getLocalValue(name), value);
    }
    else {
        test.strictEqual(result, value);
        test.strictEqual(context.getLocalValue(name), value);
    }
}

exports['let variable with values'] = function (test) {
    evaluate('let a = 1', 'a', 1, test);
    evaluate('let a = "foo"', 'a', "foo", test);
};

exports['let variable with array'] = function (test) {
    evaluate('let a = [1, 2, 3]', 'a', [1, 2, 3], test);
    evaluate('let a = [1, 1+1, 2+1]', 'a', [1, 2, 3], test);
};

exports['let mutable variable with values'] = function (test) {
    evaluate('let mut a = 1', 'a', 1, test);
    evaluate('let mut a = "foo"', 'a', "foo", test);
};

exports['let variable with arithmetic expressions'] = function (test) {
    evaluate('let a = 1+2', 'a', 3, test);
    evaluate('let a = 355/113', 'a', 355/113, test);
};

