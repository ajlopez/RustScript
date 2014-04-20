
var rustscript = require('..');

exports['context with println! function'] = function (test) {
    var context = rustscript.createContext();
    
    var println = context.getLocalValue('println!');
    
    test.ok(println);
    test.equal(typeof println, 'function');
};

exports['context with range function'] = function (test) {
    var context = rustscript.createContext();
    
    var rangefn = context.getLocalValue('range');
    
    test.ok(rangefn);
    test.equal(typeof rangefn, 'function');
    
    var range = rangefn(1, 3);
    
    test.ok(range);
    
    test.ok(range.hasNext());
    test.equal(range.next(), 1);
    test.ok(range.hasNext());
    test.equal(range.next(), 2);
    test.ok(range.hasNext());
    test.equal(range.next(), 3);
    test.ok(!range.hasNext());
};