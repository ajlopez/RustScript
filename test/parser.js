
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

exports['parse integer number as term'] = function (test) {
    var parser = parsers.createParser('123');
    
    var result = parser.parse("Term");
    
    test.ok(result);
    test.equal(result.value.evaluate(null), 123);
    test.equal(result.type, "Term");
    
    test.equal(parser.parse("Term"), null);    
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

exports['parse name as term'] = function (test) {
    var parser = parsers.createParser('foo');
    
    var result = parser.parse("Term");
    
    test.ok(result);
    
    var context = contexts.createContext();
    
    test.equal(result.value.evaluate(context), null);
    test.equal(result.type, "Term");
    
    test.equal(parser.parse("Term"), null);    
};

exports['parse string'] = function (test) {
    var parser = parsers.createParser('"foo"');
    
    var result = parser.parse("String");
    
    test.ok(result);
    
    test.equal(result.value, 'foo');
    test.equal(result.type, "String");
    
    test.equal(parser.parse("String"), null);    
};

exports['parse string as term'] = function (test) {
    var parser = parsers.createParser('"foo"');
    
    var result = parser.parse("Term");
    
    test.ok(result);
    
    test.equal(result.value, 'foo');
    test.equal(result.type, "Term");
    
    test.equal(parser.parse("Term"), null);    
};

exports['parse empty function'] = function (test) {
    var parser = parsers.createParser('fn main() { }');
    
    var result = parser.parse("Function");
    
    var context = contexts.createContext();
    
    test.ok(result);
    test.equal(result.type, "Function");

    var fn = result.value.evaluate(context);
    
    test.ok(fn);
    test.equal(typeof fn, 'function');

    test.equal(result.value.getName(), 'main');    
    test.ok(context.getLocalValue('main'));
    
    var fn = context.getLocalValue('main');
    
    test.equal(typeof fn, "function");
    
    test.equal(parser.parse("Function"), null);
};

exports['parse function with expression'] = function (test) {
    var parser = parsers.createParser('fn one() { 1 }');
    
    var result = parser.parse("Function");
    
    var context = contexts.createContext();
    
    test.ok(result);
    test.equal(result.type, "Function");

    var fn = result.value.evaluate(context);
    
    test.ok(fn);
    test.equal(typeof fn, 'function');

    test.equal(result.value.getName(), 'one');
    test.ok(context.getLocalValue('one'));
    
    var fn = context.getLocalValue('one');
    
    test.equal(typeof fn, "function");
    
    test.equal(parser.parse("Function"), null);
};

exports['parse function with expression in many lines'] = function (test) {
    var parser = parsers.createParser('fn one() {\r\n 1\r\n }');
    
    var result = parser.parse("Function");
    
    var context = contexts.createContext();
    
    test.ok(result);
    test.equal(result.type, "Function");

    var fn = result.value.evaluate(context);
    
    test.ok(fn);
    test.equal(typeof fn, 'function');

    test.equal(result.value.getName(), 'one');
    test.ok(context.getLocalValue('one'));
    
    var fn = context.getLocalValue('one');
    
    test.equal(typeof fn, "function");
    
    test.equal(parser.parse("Function"), null);
};

exports['parse simple program'] = function (test) {
    var parser = parsers.createParser('fn main() { 42 }');

    var result = parser.parse('Program');
    
    test.ok(result);
};

exports['parse call expression'] = function (test) {
    var parser = parsers.createParser('println("hello")');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    var context = contexts.createContext();
    var argument = null;
    
    context.setLocalValue('println', function (arg) { argument = arg; });
    
    result.value.evaluate(context);
    
    test.equal(argument, "hello");
};

