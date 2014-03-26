
var parsers = require('../lib/parser');
var contexts = require('../lib/context');

function evaluate(text, context, test) {
    var parser = parsers.createParser(text);
    var result = parser.parse('Program').value.evaluate(context);
    
    if (test) {
        test.equal(parser.next(), null);
        test.equal(parser.parse('Program'), null);
    }
        
    return result;
}

exports['evaluate empty module'] = function (test) {
    var context = contexts.createContext();
    var result = evaluate('mod module { }',context, test);
    test.ok(result);
    test.equal(result.getName(), 'module');
    test.strictEqual(result, context.getValue('module'));
};
