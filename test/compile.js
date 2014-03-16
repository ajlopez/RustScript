
var rustscript = require('..');

exports['compile simple function'] = function (test) {
    var context = rustscript.createContext();
    test.ok(rustscript.compile('fn main() { 42 }', context));
    
    var result = context.getLocalValue('main');
    
    test.equal(result(), 42);
};