
var parsers = require('../lib/parser');
var contexts = require('../lib/context');

function parse(text, context) {
    var parser = parsers.createParser(text);
    if (!context)
        context = contexts.createContext();
    return parser.parse('Module').value.evaluate(context);
}

exports['parse and evaluate empty mod'] = function (test) {
    var context = contexts.createContext();
    var mod = parse('mod module { }', context);
    
    test.ok(mod);
    
    test.equal(typeof mod, 'object');
    test.equal(mod.getName(), 'module');
    test.ok(mod.getContext());
    
    test.equal(context.hasLocalValue('module'), true);
    test.equal(context.hasPublicValue('module'), false);
    test.strictEqual(mod, context.getLocalValue('module'));
};

exports['parse and evaluate module with local function'] = function (test) {
    var context = contexts.createContext();
    var mod = parse('mod module { fn one() { 1 } }', context);
    
    test.ok(mod);
    
    test.equal(typeof mod, 'object');
    test.equal(mod.getName(), 'module');
    
    var modctx = mod.getContext();
    test.ok(modctx);
    test.ok(modctx.hasLocalValue('one'));
    test.equal(modctx.hasPublicValue('one'), false);
    
    var fn = modctx.getLocalValue('one');
    test.ok(fn);
    test.equal(typeof fn, 'function');
    
    test.equal(context.hasLocalValue('module'), true);
    test.equal(context.hasPublicValue('module'), false);
    test.strictEqual(mod, context.getLocalValue('module'));
};

