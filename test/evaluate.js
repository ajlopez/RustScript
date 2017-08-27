
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

exports['evaluate module with public function'] = function (test) {
    var context = contexts.createContext();
    var result = evaluate('mod module { pub fn one() { return 1 }}',context, test);
    test.ok(result);
    test.equal(result.getName(), 'module');
    test.strictEqual(result, context.getValue('module'));
    var fn = result.getContext().getPublicValue('one');
    test.ok(fn);
    test.equal(typeof fn, "function");
    test.equal(fn(), 1);
};

exports['evaluate program with two functions'] = function (test) {
    var context = contexts.createContext();
    var result = evaluate('fn one() { return 1; } fn two() { return 2; }',context, test);
    test.ok(result);
	
	var one = context.getValue('one');
	test.ok(one);
	test.equal(typeof one, 'function');
	test.equal(one(), 1);
	
	var two = context.getValue('two');
	test.ok(two);
	test.equal(typeof two, 'function');
	test.equal(two(), 2);
};
