
const rustscript = require('..');

exports['context with println! function'] = function (test) {
    const context = rustscript.createContext();
    
    const println = context.getLocalValue('println!');
    
    test.ok(println);
    test.equal(typeof println, 'function');
};

exports['context with range function'] = function (test) {
    const context = rustscript.createContext();
    
    const rangefn = context.getLocalValue('range');
    
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

