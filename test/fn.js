
var parsers = require('../lib/parser');
var contexts = require('../lib/context');

function parse(text, context) {
    var parser = parsers.createParser(text);
    if (!context)
        context = contexts.createContext();
    return parser.parse('Function').value.evaluate(context);
}

exports['parse and evaluate simple function'] = function (test) {
    var fn = parse('fn one() { 1 }');
    
    test.ok(fn);
    test.equal(typeof fn, 'function');
    test.equal(fn(), 1);
};

exports['parse and evaluate function with two expressions'] = function (test) {
    var fn = parse('fn one() { 1; 2 }');
    
    test.ok(fn);
    test.equal(typeof fn, 'function');
    test.equal(fn(), 2);
};

exports['parse and evaluate function with two expressions returning unit'] = function (test) {
    var fn = parse('fn one() { 1; 2; }');
    
    test.ok(fn);
    test.equal(typeof fn, 'function');
    test.equal(fn(), null);
};

exports['parse and evaluate function with one parameter'] = function (test) {
    var fn = parse('fn succ(x) { x + 1 }');
    
    test.ok(fn);
    test.equal(typeof fn, 'function');
    test.equal(fn(0), 1);
    test.equal(fn(1), 2);
    test.equal(fn(2), 3);
};

exports['parse and evaluate function with two parameters'] = function (test) {
    var fn = parse('fn add(x, y) { x + y }');
    
    test.ok(fn);
    test.equal(typeof fn, 'function');
    test.equal(fn(0, 1), 1);
    test.equal(fn(1, 2), 3);
    test.equal(fn(2, 4), 6);
};

exports['parse and get function in context'] = function (test) {
    var context = contexts.createContext();
    var fn = parse('fn add(x, y) { x + y }', context);
    
    test.ok(fn);
    test.equal(typeof fn, 'function');
    
    test.strictEqual(fn, context.getLocalValue('add'));
    test.equal(context.hasLocalValue('add'), true);
    test.equal(context.hasPublicValue('add'), false);
};

exports['parse and get public function in context'] = function (test) {
    var context = contexts.createContext();
    var fn = parse('pub fn add(x, y) { x + y }', context);
    
    test.ok(fn);
    test.equal(typeof fn, 'function');
    
    test.strictEqual(fn, context.getLocalValue('add'));
    test.strictEqual(fn, context.getPublicValue('add'));
    test.equal(context.hasLocalValue('add'), true);
    test.equal(context.hasPublicValue('add'), true);
};
