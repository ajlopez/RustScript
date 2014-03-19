
var parsers = require('../lib/parser');
var contexts = require('../lib/context');

function evaluate(text, name, value, test) {
    var parser = parsers.createParser(text);
    var context = contexts.createContext();
    
    var result = parser.parse('Expression').value.evaluate(context);
    test.equal(parser.parse('Expression'), null);
    
    test.ok(result);
    test.strictEqual(result, value);
    test.strictEqual(context.getLocalValue(name), value);
}

exports['let variable with values'] = function (test) {
    evaluate('let a = 1', 'a', 1, test);
    evaluate('let a = "foo"', 'a', "foo", test);
};

exports['let variable with arithmetic expressions'] = function (test) {
    evaluate('let a = 1+2', 'a', 3, test);
    evaluate('let a = 355/113', 'a', 355/113, test);
};
