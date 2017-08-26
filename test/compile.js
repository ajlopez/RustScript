
var rustscript = require('..');

exports['compile simple function'] = function (test) {
    var context = rustscript.createContext();
    test.ok(rustscript.compile('fn main() { 42 }', context));
    
    var result = context.getLocalValue('main');
    
    test.equal(result(), 42);
};

exports['compile two simple function'] = function (test) {
    var context = rustscript.createContext();
    test.ok(rustscript.compile('fn one() { 1 } fn main()  { 42 }', context));
    
    var result = context.getLocalValue('main');
    
    test.equal(result(), 42);
};

exports['compile hello program'] = function (test) {
    var context = rustscript.createContext();
    test.ok(rustscript.compile('fn main() { println!("hello"); }', context));
    
    var result = context.getLocalValue('main');
    
    test.ok(result);
};
