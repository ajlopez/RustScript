
var simplegrammar = require('simplegrammar'),
    contexts = require('./context');

var get = simplegrammar.get;
var peek = simplegrammar.peek;

function Module(name, context) {
    this.getName = function () { return name; }
    
    this.getContext = function () { return context; }
}

function ConstantExpression(value) {
    this.evaluate = function () {
        return value;
    };
}

function QualifiedNameExpression(expr, name) {
    this.evaluate = function (context) {
        return expr.evaluate(context).getContext().getPublicValue(name);
    };
}

function NameExpression(name) {
    this.evaluate = function (context) {
        return context.getValue(name);
    };
    
    this.getName = function () { return name; };
    
    this.setValue = function (context, value) {
        context.setValue(name, value);
    }
}

function AssignVariableExpression(name, expr) {
    this.evaluate = function (context) {
        var value = expr.evaluate(context);
        context.setValue(name, value);
        return value;
    };
}

function LetExpression(name, expr, mutable) {
    this.evaluate = function (context) {
        var value = expr.evaluate(context);
        context.defineLocalValue(name, value, { mutable: mutable });
        return value;
    };
}

function FunctionExpression(name, parnames, body, options) {
    options = options || { };
    
    this.evaluate = function (context) {
        var fn = function() { 
            var newcontext = contexts.createContext(context);
            
            for (var k in parnames)
                newcontext.defineLocalValue(parnames[k], arguments[k]);
            
            return body.evaluate(newcontext); 
        };
        
        context.defineLocalValue(name, fn, { public: options.public });
        return fn;
    }
    
    this.getName = function () { return name; }
}

function ModuleExpression(name, body) {
    this.evaluate = function (context) {
        var newcontext = contexts.createContext(context);
        var module = new Module(name, newcontext);
        context.defineLocalValue(name, module);
        body.evaluate(newcontext);
        return module;
    }
    
    this.getName = function () { return name; }
}

function EqualExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) == right.evaluate(context);
    };
}

function NotEqualExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) != right.evaluate(context);
    };
}

function LessExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) < right.evaluate(context);
    };
}

function GreaterExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) > right.evaluate(context);
    };
}

function LessEqualExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) <= right.evaluate(context);
    };
}

function GreaterEqualExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) >= right.evaluate(context);
    };
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

function ModExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) % right.evaluate(context);
    };
}

function BitwiseOrExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) | right.evaluate(context);
    };
}

function BitwiseAndExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) & right.evaluate(context);
    };
}

function AndExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) && right.evaluate(context);
    };
}

function OrExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) || right.evaluate(context);
    };
}

function CompositeExpression(exprlist) {
    var l = exprlist.length;
    this.evaluate = function (context) {
        for (var k = 0; k < l - 1; k++) {
            exprlist[k].evaluate(context);
            
            if (context.break || context.continue)
                return;
        }
        
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

function ForExpression(name, valuesexpr, expr) {
    this.evaluate = function (context) {
        var newcontext = contexts.createContext(context);
        var values = valuesexpr.evaluate(context);
        var result = null;
        
        while (values.hasNext()) {
            newcontext.defineLocalValue(name, values.next());
            result = expr.evaluate(newcontext);
        }   
        
        return result;
    }
}

function WhileExpression(condition, expr) {
    this.evaluate = function (context) {
        context.break = false;
        context.continue = false;
        
        while (condition.evaluate(context) == true) {
            expr.evaluate(context);
            if (context.break)
                break;
            context.continue = false;
        }
        
        context.break = false;
        context.continue = false;
        
        return null;
    };
}

function LoopExpression(expr) {
    this.evaluate = function (context) {
        context.break = false;
        context.continue = false;
        
        while (true) {
            expr.evaluate(context);
            
            if (context.break)
                break;
            context.continue = false;
        }
        
        context.break = false;
        context.continue = false;
        
        return null;
    };
}

function ReturnExpression(expr) {
    this.evaluate = function (context) {
        return expr.evaluate(context);
    };
}

function BreakExpression(expr) {
    this.evaluate = function (context) {
        context.break = true;
        return null;
    };
}

function ContinueExpression(expr) {
    this.evaluate = function (context) {
        context.continue = true;
        return null;
    };
}
var rules = [
    get([' ','\t','\r', '\n']).oneOrMore().skip(),
    get('/').and('/').upTo('\n').skip(),
    
    // Integer
    get('0-9').oneOrMore().generate('Integer', function (value) { return new ConstantExpression(parseInt(value)) }),
        
    // Booleans
    get('true').generate('Name', function (value) { return new ConstantExpression(true); }),
    get('false').generate('Name', function (value) { return new ConstantExpression(false); }),
    
    // Name
    get(['a-z', 'A-Z']).oneOrMore().and(get('!').zeroOrMore()).generate('Name', function (value) { return new NameExpression(value) }),
    
    get('"~"').generate('String', function (value) { return new ConstantExpression(value); }),
    
    // Separators    
    get('(').generate('LeftPar'),
    get(')').generate('RightPar'),
    get('{').generate('LeftHandlebar'),
    get('}').generate('RightHandlebar'),
    get(';').generate('SemiColon'),
    get(',').generate('Comma'),

    // Operators
    get('+').generate('Plus'),
    get('-').generate('Minus'),
    get('*').generate('Multiply'),
    get('/').generate('Divide'),
    get('%').generate('Module'),
    get('||').generate('Or'),
    get('&&').generate('And'),
    get('|').generate('BitwiseOr'),
    get('&').generate('BitwiseAnd'),
    get('==').generate('Equal'),
    get('!=').generate('NotEqual'),
    get('<=').generate('LessEqual'),
    get('<').generate('Less'),
    get('>=').generate('GreaterEqual'),
    get('>').generate('Greater'),
    get('=').generate('Assign'),
    get('::').generate('DoubleColon'),
    
    // Program
    
    get('CommandList').generate('Program', function (value) { return new CompositeExpression(value); }),
    get('CommandList', 'Command').generate('CommandList', function (values) { var list = values[0]; list.push(values[1]); return list; }),
    get('Command').generate('CommandList', function (value) { return [ value ]; }),
    peek('RightHandlebar').generate('CommandList', function (value) { return [ ]; }),
    get('Function').generate('Command'),
    get('Module').generate('Command'),
    
    // Function
    get('fn', 'Name', 'LeftPar', 'ParameterList', 'RightPar', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar').generate('Function',
        function (values) { return new FunctionExpression(values[1].getName(), values[3], values[6]); }),
    // TODO Review
    get('pub').generate('Pub'),
    get('Pub', 'fn', 'Name', 'LeftPar', 'ParameterList', 'RightPar', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar').generate('Function',
        function (values) { return new FunctionExpression(values[2].getName(), values[4], values[7], { public: true }); }),
    
    // Module
    get('mod', 'Name', 'LeftHandlebar', 'Program', 'RightHandlebar').generate('Module',
        function (values) { return new ModuleExpression(values[1].getName(), values[3]); }),
        
    // Let
    get('let', 'mut', 'Name', 'Assign', 'Expression').generate('Expression', function (values) { return new LetExpression(values[1].getName(), values[3], true); }),
    get('let', 'Name', 'Assign', 'Expression').generate('Expression', function (values) { return new LetExpression(values[1].getName(), values[3], false); }),
        
    // Return
    get('return', 'Expression').generate('Expression', function (values) { return new ReturnExpression(values[1]); }),
    get('return').generate('Expression', function (values) { return new ReturnExpression(null); }),
    
    // Break
    get('break').generate('Expression', function (values) { return new BreakExpression(null); }),
    
    // Break
    get('continue').generate('Expression', function (values) { return new ContinueExpression(null); }),
    
    // Bracket Expression (while, if, loop, ... )
    get('BracketExpression').generate('Expression'),
        
    // While
    get('while', 'Expression', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar').generate('BracketExpression', function (values) { return new WhileExpression(values[1], values[3]); }),
        
    // For
    get('for', 'Name', 'in', 'Expression', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar').generate('BracketExpression', function (values) { return new ForExpression(values[1].getName(), values[3], values[5]); }),
        
    // Loop
    get('loop', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar').generate('BracketExpression', function (values) { return new LoopExpression(values[2]); }),
        
    // If
    get('IfExpression').generate('BracketExpression'),
    get('if', 'Expression', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar', 'else', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar').generate('IfExpression',
        function (values) { return new IfExpression(values[1], values[3], values[7]);  }),
    get('if', 'Expression', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar', 'else', 'IfExpression').generate('IfExpression',
        function (values) { return new IfExpression(values[1], values[3], values[6]);  }),
    get('if', 'Expression', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar').generate('IfExpression',
        function (values) { return new IfExpression(values[1], values[3]); }),
        
    // Expression List
    get('ExpressionList').generate('CompositeExpression', function (value) { return new CompositeExpression(value); }),
    peek('RightHandlebar').generate('ExpressionList', function (values) { return [] }),
    get('BracketExpression', 'ExpressionList').generate('ExpressionList', function (values) { var list = values[1]; list.unshift(values[0]); return list; }),
    get('Expression', peek('RightHandlebar')).generate('ExpressionList', function (values) { return [ values[0] ]; }),
    get('Expression', 'SemiColon', peek('RightHandlebar')).generate('ExpressionList', function (values) { return [ values[0], null ]; }),
    get('Expression', 'SemiColon', 'ExpressionList').generate('ExpressionList', function (values) { var list = values[2]; list.unshift(values[0]); return list; }),
    
    // Parameter List
    peek('RightPar').generate('ParameterList', function (values) { return [] }),
    get('Name', peek('RightPar')).generate('ParameterList', function (values) { return [ values[0].getName() ] }),
    get('Name', 'Comma', 'ParameterList').generate('ParameterList', function (values) { var list = values[2]; list.unshift(values[0].getName()); return list; }),
    
    // Assign to variable
    get('Name', 'Assign', 'Expression').generate('Expression', function (values) { return new AssignVariableExpression(values[0].getName(), values[2]); }),
    
    // Or Expression Level 6
    get('Expression6').generate('Expression'),
    get('Expression6', 'Or', 'Expression5').generate('Expression6', function (values) { return new OrExpression(values[0], values[2]); }),
    
    // And Expression Level 5
    get('Expression5').generate('Expression6'),
    get('Expression5', 'And', 'Expression4').generate('Expression5', function (values) { return new AndExpression(values[0], values[2]); }),
    
    // Comparison Expression Level 4
    get('Expression4').generate('Expression5'),
    get('Expression4', 'Equal', 'Expression3').generate('Expression4', function (values) { return new EqualExpression(values[0], values[2]); }),
    get('Expression4', 'NotEqual', 'Expression3').generate('Expression4', function (values) { return new NotEqualExpression(values[0], values[2]); }),
    get('Expression4', 'LessEqual', 'Expression3').generate('Expression4', function (values) { return new LessEqualExpression(values[0], values[2]); }),
    get('Expression4', 'GreaterEqual', 'Expression3').generate('Expression4', function (values) { return new GreaterEqualExpression(values[0], values[2]); }),
    get('Expression4', 'Less', 'Expression3').generate('Expression4', function (values) { return new LessExpression(values[0], values[2]); }),
    get('Expression4', 'Greater', 'Expression3').generate('Expression4', function (values) { return new GreaterExpression(values[0], values[2]); }),
    
    // Bitwise Or Expression Level 3
    get('Expression3').generate('Expression4'),
    get('Expression3', 'BitwiseOr', 'Expression2').generate('Expression3', function (values) { return new BitwiseOrExpression(values[0], values[2]); }),

    // Bitwise And Expression Level 2
    get('Expression2').generate('Expression3'),
    get('Expression2', 'BitwiseAnd', 'Expression1').generate('Expression2', function (values) { return new BitwiseAndExpression(values[0], values[2]); }),
    
    // Expression Level 1
    get('Expression1').generate('Expression2'),
    get('Expression1', 'Plus', 'Expression0').generate('Expression1', function (values) { return new AddExpression(values[0], values[2]); }),
    get('Expression1', 'Minus', 'Expression0').generate('Expression1', function (values) { return new SubtractExpression(values[0], values[2]); }),
    
    // Expression Level 0
    get('Expression0').generate('Expression1'),
    get('Expression0', 'Multiply', 'Term').generate('Expression0', function (values) { return new MultiplyExpression(values[0], values[2]); }),
    get('Expression0', 'Divide', 'Term').generate('Expression0', function (values) { return new DivideExpression(values[0], values[2]); }),
    get('Expression0', 'Module', 'Term').generate('Expression0', function (values) { return new ModExpression(values[0], values[2]); }),

    // Term
    get('Term').generate('Expression0'),
    get('Term', 'LeftPar', 'Arguments', 'RightPar').generate('Term', function (values) { return new CallExpression(values[0], values[2]); }),
    peek('RightPar').generate('ArgumentList', function (values) { return [] }),
    get('LeftPar', 'Expression', 'RightPar').generate('Term', function (values) { return values[1]; }),
    get('String').generate('Term'),
    get('Integer').generate('Term'),
    get('QualifiedName').generate('Term'),
    get('Name', 'DoubleColon', 'Name').generate('QualifiedName', function (values) { return new QualifiedNameExpression(values[0], values[2].getName()); }),
    get('QualifiedName', 'DoubleColon', 'Name').generate('QualifiedName', function (values) { return new QualifiedNameExpression(values[0], values[2].getName()); }),
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
