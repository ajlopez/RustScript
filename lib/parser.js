
var simplegrammar = require('simplegrammar');

var get = simplegrammar.get;
var peek = simplegrammar.peek;

function IntegerExpression(text) {
    var value = parseInt(text);
    
    this.evaluate = function () {
        return value;
    };
}

function NameExpression(name) {
    this.evaluate = function (context) {
        return context.getLocalValue(name);
    };
    
    this.getName = function () { return name; };
    
    this.setValue = function (context, value) {
        context.setLocalValue(name, value);
    }
}

function FunctionExpression(name) {
    this.evaluate = function (context) {
        context.setLocalValue(name, function () { }); 
    }
    
    this.getName = function () { return name; }
}

var rules = [
    get([' ','\t','\r']).oneOrMore().skip(),
    get('0-9').oneOrMore().generate('Integer', function (value) { return new IntegerExpression(value) }),
    get(['a-z', 'A-Z']).oneOrMore().generate('Name', function (value) { return new NameExpression(value) }),
    get('"~"').generate('String'),
    
    // Separators
    
    get('(').generate('LeftPar'),
    get(')').generate('RightPar'),
    get('{').generate('LeftHandlebar'),
    get('}').generate('RightHandlebar'),
    
    // Function
    get('fn', 'Name', 'LeftPar', 'RightPar', 'LeftHandlebar', 'RightHandlebar').generate('Function',
        function (values) { return new FunctionExpression(values[1].getName()); }),
    
    // Term
    get('Term').generate('Expression0'),
    get('String').generate('Term'),
    get('Integer').generate('Term'),
    get('Name').generate('Term'),
];

function createParser(text) {
    return simplegrammar.createParser(text, rules);    
}

module.exports = {
    createParser: createParser
};
