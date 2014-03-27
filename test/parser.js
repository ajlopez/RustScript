
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
    
    test.equal(result.value.getName(), 'foo');
    test.equal(result.value.evaluate(context), null);
    test.equal(result.type, "Name");
    
    test.equal(parser.parse("Name"), null);    
};

exports['parse name after comment'] = function (test) {
    var parser = parsers.createParser('// This is a comment \r\nfoo');
    
    var result = parser.parse("Name");
    
    test.ok(result);
    
    var context = contexts.createContext();
    
    test.equal(result.value.getName(), 'foo');
    test.equal(result.value.evaluate(context), null);
    test.equal(result.type, "Name");
    
    test.equal(parser.parse("Name"), null);    
};

exports['parse name and comment'] = function (test) {
    var parser = parsers.createParser('foo // This is another comment\r\n');
    
    var result = parser.parse("Name");
    
    test.ok(result);
    
    var context = contexts.createContext();
    
    test.equal(result.value.getName(), 'foo');
    test.equal(result.value.evaluate(context), null);
    test.equal(result.type, "Name");
    
    test.equal(parser.parse("Name"), null);    
};

exports['parse name with bang'] = function (test) {
    var parser = parsers.createParser('foo!');
    
    var result = parser.parse("Name");
    
    test.ok(result);
    
    var context = contexts.createContext();
    
    test.equal(result.value.getName(), 'foo!');
    test.equal(result.value.evaluate(context), null);
    test.equal(result.type, "Name");
    
    test.equal(parser.parse("Name"), null);    
};

exports['parse name as term'] = function (test) {
    var parser = parsers.createParser('foo');
    
    var result = parser.parse("Term");
    
    test.ok(result);
    
    var context = contexts.createContext();
    
    test.equal(result.value.getName(), 'foo');
    test.equal(result.value.evaluate(context), null);
    test.equal(result.type, "Term");
    
    test.equal(parser.parse("Term"), null);    
};

exports['parse string'] = function (test) {
    var parser = parsers.createParser('"foo"');
    
    var result = parser.parse("String");
    
    test.ok(result);
    
    test.equal(result.value.evaluate(null), 'foo');
    test.equal(result.type, "String");
    
    test.equal(parser.parse("String"), null);    
};

exports['parse string as term'] = function (test) {
    var parser = parsers.createParser('"foo"');
    
    var result = parser.parse("Term");
    
    test.ok(result);
    
    test.equal(result.value.evaluate(null), 'foo');
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

exports['parse public function'] = function (test) {
    var parser = parsers.createParser('pub fn one() { 1 }');
    
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
    
    context.defineLocalValue('println', function (arg) { argument = arg; });
    
    result.value.evaluate(context);
    
    test.equal(argument, "hello");
};

exports['parse call expression'] = function (test) {
    var parser = parsers.createParser('println("hello")');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    var context = contexts.createContext();
    var argument = null;
    
    context.defineLocalValue('println', function (arg) { argument = arg; });
    
    result.value.evaluate(context);
    
    test.equal(argument, "hello");
};

exports['parse if expression'] = function (test) {
    var parser = parsers.createParser('if true { 1 }');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    test.equal(parser.next(), null);
    test.equal(parser.parse('Expression'), null);
};

exports['parse if expression with variable equal expression'] = function (test) {
    var parser = parsers.createParser('if a == 1 { 1 }');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    test.equal(parser.next(), null);
    test.equal(parser.parse('Expression'), null);
};

exports['parse while expression'] = function (test) {
    var parser = parsers.createParser('while true { 1 }');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    test.equal(parser.next(), null);
    test.equal(parser.parse('Expression'), null);
};

exports['parse while expression with assign'] = function (test) {
    var parser = parsers.createParser('while true { a = 1; }');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    test.equal(parser.next(), null);
    test.equal(parser.parse('Expression'), null);
};

exports['parse while expression with composite expression'] = function (test) {
    var parser = parsers.createParser('while true { 1; 2 }');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    test.equal(parser.next(), null);
    test.equal(parser.parse('Expression'), null);
};

exports['parse while expression with composite expression having a break'] = function (test) {
    var parser = parsers.createParser('while true { 1; break; }');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    test.equal(parser.next(), null);
    test.equal(parser.parse('Expression'), null);
};

exports['parse while expression with composite expression having an if'] = function (test) {
    var parser = parsers.createParser('while a <= 10 { a = a + 1; if a == 1 { a = 1; } }');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    test.equal(parser.next(), null);
    test.equal(parser.parse('Expression'), null);
};

exports['parse loop expression'] = function (test) {
    var parser = parsers.createParser('loop { 1 }');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    test.equal(parser.next(), null);
    test.equal(parser.parse('Expression'), null);
};

exports['parse return expression without value'] = function (test) {
    var parser = parsers.createParser('return');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    test.equal(parser.next(), null);
    test.equal(parser.parse('Expression'), null);
};

exports['parse return expression with value'] = function (test) {
    var parser = parsers.createParser('return 1');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    test.equal(parser.next(), null);
    test.equal(parser.parse('Expression'), null);
};

exports['parse logical and operator'] = function (test) {
    var parser = parsers.createParser('a && b');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    test.equal(parser.next(), null);
    test.equal(parser.parse('Expression'), null);
};

exports['parse logical or operator'] = function (test) {
    var parser = parsers.createParser('a || b');

    var result = parser.parse('Expression');
    
    test.ok(result);
    test.equal(result.type, "Expression");
    test.ok(result.value);
    
    test.equal(parser.next(), null);
    test.equal(parser.parse('Expression'), null);
};

exports['parse empty module'] = function (test) {
    var parser = parsers.createParser('mod module { }');
    
    var result = parser.parse("Module");
    
    test.ok(result);
    test.equal(result.type, "Module");
    test.ok(result.value);
    test.equal(result.value.getName(), "module");
};

