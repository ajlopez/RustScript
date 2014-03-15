
var contexts = require('../lib/context');

exports['has local value of unknown variablle'] = function (test) {
    var context = contexts.createContext();
    
    test.equal(context.hasLocalValue('foo'), false);
};

exports['set and get local value'] = function (test) {
    var context = contexts.createContext();
    
    context.setLocalValue('foo', 'bar');
    test.equal(context.hasLocalValue('foo'), true);
    test.equal(context.getLocalValue('foo'), 'bar');
};