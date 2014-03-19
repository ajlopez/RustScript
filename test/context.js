
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

exports['get value from parent'] = function (test) {
    var parent = contexts.createContext();
    var context = contexts.createContext(parent);
    
    parent.setLocalValue('foo', 'bar');
    test.equal(context.getValue('foo'), 'bar');
    test.equal(context.hasLocalValue('foo'), false);
    test.equal(context.getLocalValue('foo'), null);
    test.equal(parent.hasLocalValue('foo'), true);
    test.equal(parent.getLocalValue('foo'), 'bar');
};