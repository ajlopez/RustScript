
var parsers = require('../lib/parser');
var contexts = require('../lib/context');

exports['parse integer number'] = function (test) {
    var parser = parsers.createParser('123');
    
    var result = parser.parse("Integer");
    
    test.ok(result);
    test.equal(result.value.evaluate(null), 123);
    test.equal(result.type, "Integer");
    
    test.equal(parser.parse("Integer"), null);    
};

exports['parse integer number with spaces'] = function (test) {
    var parser = parsers.createParser('  123   ');
    
    var result = parser.parse("Integer");
    
    test.ok(result);
    test.equal(result.value.evaluate(null), 123);
    test.equal(result.type, "Integer");
    
    test.equal(parser.parse("Integer"), null);    
};

exports['parse name'] = function (test) {
    var parser = parsers.createParser('foo');
    
    var result = parser.parse("Name");
    
    test.ok(result);
    
    var context = contexts.createContext();
    
    test.equal(result.value.evaluate(context), null);
    test.equal(result.type, "Name");
    
    test.equal(parser.parse("Name"), null);    
};

exports['parse empty function'] = function (test) {
    var parser = parsers.createParser('fn main() { }');
    
    var result = parser.parse("Function");
    
    test.ok(result);
    test.equal(result.type, "Function");
    test.equal(result.value.evaluate(null), null);
    test.equal(result.value.getName(), 'main');
    
    test.equal(parser.parse("Function"), null);
};
