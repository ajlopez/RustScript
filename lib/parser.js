
var simplegrammar = require('simplegrammar');

var get = simplegrammar.get;
var peek = simplegrammar.peek;

function ConstantExpression(value) {
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

function ArgumentsExpression(exprlist) {
    var l = exprlist.length;
    
    this.evaluate = function (context) {
        var result = [];
        
        for (var k = 0; k < l; k++)
            result.push(exprlist[k].evaluate(context));
            
        return result;
    };
}

function CallExpression(expr, args) {
    this.evaluate = function (context) {
        var argvalues = args.evaluate(context);
        var fn = expr.evaluate(context);
        return fn.apply(null, argvalues);
    };
}

function IfExpression(condition, thenexpr, elseexpr) {
    this.evaluate = function (context) {
        var result = condition.evaluate(context);
        
        if (result === true)
            return thenexpr.evaluate(context);
        else if (elseexpr)
            return elseexpr.evaluate(context);
        
        return null;
    };
}

var rules = [
    get([' ','\t','\r', '\n']).oneOrMore().skip(),
    get('/').and('/').upTo('\n').skip(),
    get('0-9').oneOrMore().generate('Integer', function (value) { return new ConstantExpression(parseInt(value)) }),
    get(['a-z', 'A-Z']).oneOrMore().and(get('!').zeroOrMore()).generate('Name', function (value) { return new NameExpression(value) }),
    get('"~"').generate('String', function (value) { return new ConstantExpression(value); }),
    
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
    
    // Program
    
    get('CommandList').generate('Program', function (value) { return new CompositeExpression(value); }),
    get('CommandList', 'Command').generate('Program', function (value) { var list = values[0]; list.push(values[1]); return list; }),
    get('Command').generate('CommandList', function (value) { return [ value ]; }),
    get('Function').generate('Command'),
    
    // Function
    get('fn', 'Name', 'LeftPar', 'RightPar', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar').generate('Function',
        function (values) { return new FunctionExpression(values[1].getName(), values[5]); }),
        
    // If
    get('if', 'Expression', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar', 'else', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar').generate('Expression',
        function (values) { return new IfExpression(values[1], values[3], values[7]);  }),
    get('if', 'Expression', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar').generate('Expression',
        function (values) { return new IfExpression(values[1], values[3]); }),
        
    // Booleans
    get('true').generate('Term', function (value) { return new ConstantExpression(true); }),
    get('false').generate('Term', function (value) { return new ConstantExpression(false); }),
        
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
    get('Term', 'LeftPar', 'Arguments', 'RightPar').generate('Term', function (values) { return new CallExpression(values[0], values[2]); }),
    peek('RightPar').generate('ArgumentList', function (values) { return [] }),
    get('LeftPar', 'Expression', 'RightPar').generate('Term', function (values) { return values[1]; }),
    get('String').generate('Term'),
    get('Integer').generate('Term'),
    get('Name').generate('Term'),
    
    // Arguments, ArgumentList
    get('ArgumentList').generate('Arguments', function (value) { return new ArgumentsExpression(value); }),
    get('Expression', 'Comma', 'ArgumentList').generate('ArgumentList', function (values) { var list = values[2]; list.unshift(values[0]); return list; }),
    get('Expression', peek('RightPar')).generate('ArgumentList', function (values) { return [ values[0] ]; }),
    peek('RightPar').generate('ArgumentList', function (value) { return []; }),
];

function createParser(text) {
    return simplegrammar.createParser(text, rules);    
}

module.exports = {
    createParser: createParser
};
