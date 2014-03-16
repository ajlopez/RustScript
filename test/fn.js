
var parsers = require('../lib/parser');
var contexts = require('../lib/context');

function parse(text) {
    var parser = parsers.createParser(text);
    var context = contexts.createContext();
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
