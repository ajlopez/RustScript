
var contexts = require('../lib/context');

exports['has local value of unknown variablle'] = function (test) {
    var context = contexts.createContext();
    
    test.equal(context.hasLocalValue('foo'), false);
};

exports['define and get local value'] = function (test) {
    var context = contexts.createContext();
    
    context.defineLocalValue('foo', 'bar');
    test.equal(context.hasLocalValue('foo'), true);
    test.equal(context.getLocalValue('foo'), 'bar');
};

exports['define mutable, set value and get local value'] = function (test) {
    var context = contexts.createContext();
    
    context.defineLocalValue('foo', 'none', { mutable: true });
    context.setLocalValue('foo', 'bar');
    test.equal(context.hasLocalValue('foo'), true);
    test.equal(context.getLocalValue('foo'), 'bar');
};

exports['raise if set undefined name'] = function (test) {
    var context = contexts.createContext();
    
    test.throws(function () {
        context.setLocalValue('foo', 'bar');
    },
    function (err) {
        test.equal(err, "undefined 'foo'");
        return true;
    });
};

exports['raise if modify immutable value'] = function (test) {
    var context = contexts.createContext();
    context.defineLocalValue('foo', 'none');
    
    test.throws(function () {
        context.setLocalValue('foo', 'bar');
    },
    function (err) {
        test.equal(err, "immutable 'foo'");
        return true;
    });
};

exports['get value from parent'] = function (test) {
    var parent = contexts.createContext();
    var context = contexts.createContext(parent);
    
    parent.defineLocalValue('foo', 'bar');
    test.equal(context.getValue('foo'), 'bar');
    test.equal(context.hasLocalValue('foo'), false);
    test.equal(context.getLocalValue('foo'), null);
    test.equal(parent.hasLocalValue('foo'), true);
    test.equal(parent.getLocalValue('foo'), 'bar');
};

exports['set and get public value'] = function (test) {
    var context = contexts.createContext();
    
    context.defineLocalValue('foo', 'bar', { public: true });
    test.equal(context.getValue('foo'), 'bar');
    test.equal(context.getPublicValue('foo'), 'bar');
    test.equal(context.hasLocalValue('foo'), true);
    test.equal(context.hasPublicValue('foo'), true);
}

