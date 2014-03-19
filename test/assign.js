
var parsers = require('../lib/parser');
var contexts = require('../lib/context');

function evaluate(text, value, test) {
    var parser = parsers.createParser(text);
    var context = contexts.createContext();
    
    var result = parser.parse('Expression').value.evaluate(context);
    test.equal(parser.parse('Expression'), null);
    
    test.ok(result);
    test.strictEqual(result, value);
    test.strictEqual(context.getLocalValue('a'), value);
}

exports['assign values to variable'] = function (test) {
    evaluate('a = 1', 1, test);
    evaluate('a = "foo"', "foo", test);
};

exports['assign arithmetic expressions to variable'] = function (test) {
    evaluate('a = 1+2', 3, test);
    evaluate('a = 355/113', 355/113, test);
};
