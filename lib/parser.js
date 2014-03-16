
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

function FunctionExpression(name, body) {
    this.evaluate = function (context) {
        var fn = function() { return body.evaluate(context); };
        context.setLocalValue(name, fn);
        return fn;
    }
    
    this.getName = function () { return name; }
}

function AddExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) + right.evaluate(context);
    };
}

function SubtractExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) - right.evaluate(context);
    };
}

function MultiplyExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) * right.evaluate(context);
    };
}

function DivideExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) / right.evaluate(context);
    };
}

function CompositeExpression(exprlist) {
    var l = exprlist.length;
    this.evaluate = function (context) {
        for (var k = 0; k < l - 1; k++)
            exprlist[k].evaluate(context);
        
        if (exprlist[l - 1] == null)
            return null;
            
        return exprlist[l - 1].evaluate(context);
    };
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
    get(';').generate('SemiColon'),

    // Operators
    get('+').generate('Plus'),
    get('-').generate('Minus'),
    get('*').generate('Multiply'),
    get('/').generate('Divide'),
    
    // Function
    get('fn', 'Name', 'LeftPar', 'RightPar', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar').generate('Function',
        function (values) { return new FunctionExpression(values[1].getName(), values[5]); }),
        
    // Expression List
    get('ExpressionList').generate('CompositeExpression', function (value) { return new CompositeExpression(value); }),
    peek('RightHandlebar').generate('ExpressionList', function (values) { return [] }),
    get('Expression', peek('RightHandlebar')).generate('ExpressionList', function (values) { return [ values[0] ]; }),
    get('Expression', 'SemiColon', peek('RightHandlebar')).generate('ExpressionList', function (values) { return [ values[0], null ]; }),
    get('Expression', 'SemiColon', 'ExpressionList').generate('ExpressionList', function (values) { var list = values[2]; list.unshift(values[0]); return list; }),
    
    // Expression Level 1
    get('Expression1').generate('Expression'),
    get('Expression1', 'Plus', 'Expression0').generate('Expression1', function (values) { return new AddExpression(values[0], values[2]); }),
    get('Expression1', 'Minus', 'Expression0').generate('Expression1', function (values) { return new SubtractExpression(values[0], values[2]); }),
    
    // Expression Level 0
    get('Expression0').generate('Expression1'),
    get('Expression0', 'Multiply', 'Term').generate('Expression0', function (values) { return new MultiplyExpression(values[0], values[2]); }),
    get('Expression0', 'Divide', 'Term').generate('Expression0', function (values) { return new DivideExpression(values[0], values[2]); }),

    // Term
    get('Term').generate('Expression0'),
    get('LeftPar', 'Expression', 'RightPar').generate('Term', function (values) { return values[1]; }),
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
