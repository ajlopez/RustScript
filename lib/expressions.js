
var contexts = require('./context');

function Module(name, context) {
    this.getName = function () { return name; }
    
    this.getContext = function () { return context; }
}

function Tuple(values) {
    this.size = function () { return values.length; }
    this.get = function (n) { return values[n]; }
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

function StructExpression(name, names) {
}

function EnumExpression(name, names) {
}

function ArrayExpression(exprs) {
    this.evaluate = function (context) {
        var result = [];
        
        exprs.forEach(function (expr) {
            result.push(expr.evaluate(context));
        });
        
        return result;
    };
}

function TupleExpression(exprs) {
    this.evaluate = function (context) {
        var result = [];
        
        exprs.forEach(function (expr) {
            result.push(expr.evaluate(context));
        });
        
        return new Tuple(result);
    };
}

function MatchExpression(expr, patterns) {
    var l = patterns.length;
    
    this.evaluate = function (context) {
        var value = expr.evaluate(context);
        
        for (var k = 0; k < l; k++)
            if (patterns[k].match(value))
                return patterns[k].evaluate(context);
    }
}

function PatternExpression(headexpr, expr) {
    var head;
    var isdefault = false;
    
    if (!headexpr.getName)
        head = headexpr.evaluate(null);
        
    if (headexpr.getName && headexpr.getName() === '_')
        isdefault = true;
    
    this.match = function (value) {
        if (isdefault)
            return true;
            
        return value === head;
    }
    
    this.evaluate = function (context) {
        return expr.evaluate(context);
    }
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
        return left.evaluate(context) === right.evaluate(context);
    };
}

function NotEqualExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) !== right.evaluate(context);
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
        
        while (condition.evaluate(context) === true) {
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

module.exports = {
	constant: function (value) { return new ConstantExpression(value); },
    struct: function (name, names) { return new StructExpression(name, names); },
	array: function (exprs) { return new ArrayExpression(exprs); },
	tuple: function (values) { return new TupleExpression(values); },
	match: function (expr, patterns) { return new MatchExpression(expr, patterns); },
	pattern: function (headexpr, expr) { return new PatternExpression(headexpr, expr); },
	name: function (name) { return new NameExpression(name); },
	let: function (name, expr, mutable) { return new LetExpression(name, expr, mutable); },
	enum: function (name, names) { return new EnumExpression(name, names); },
	equal: function (left, right) { return new EqualExpression(left, right); },
	notEqual: function (left, right) { return new NotEqualExpression(left, right); },
	less: function (left, right) { return new LessExpression(left, right); },
	greater: function (left, right) { return new GreaterExpression(left, right); },
	lessEqual: function (left, right) { return new LessEqualExpression(left, right); },
	greaterEqual: function (left, right) { return new GreaterEqualExpression(left, right); },
	module: function (name, body) { return new ModuleExpression(name, body); },
	add: function (left, right) { return new AddExpression(left, right); },
	subtract: function (left, right) { return new SubtractExpression(left, right); },
	multiply: function (left, right) { return new MultiplyExpression(left, right); },
	divide: function (left, right) { return new DivideExpression(left, right); },
	mod: function (left, right) { return new ModExpression(left, right); },
	bitwiseOr: function (left, right) { return new BitwiseOrExpression(left, right); },
	bitwiseAnd: function (left, right) { return new BitwiseAndExpression(left, right); },
	or: function (left, right) { return new OrExpression(left, right); },
	and: function (left, right) { return new AndExpression(left, right); },
	composite: function (exprlist) { return new CompositeExpression(exprlist); },
	if: function (condition, thenexpr, elseexpr) { return new IfExpression(condition, thenexpr, elseexpr); },
    while: function (condition, expr) { return new WhileExpression(condition, expr); },
    assign: function (name, expr) { return new AssignVariableExpression(name, expr); },
    call: function (expr, args) { return new CallExpression(expr, args); },
	for: function (name, valuesexpr, expr) { return new ForExpression(name, valuesexpr, expr); },
	function: function (name, parnames, body, options) { return new FunctionExpression(name, parnames, body, options); },
	arguments: function (exprlist) { return new ArgumentsExpression(exprlist); },
	
    ConstantExpression: ConstantExpression,
    QualifiedNameExpression: QualifiedNameExpression,
    StructExpression: StructExpression,
    NotEqualExpression: NotEqualExpression,
    LoopExpression: LoopExpression,
    ReturnExpression: ReturnExpression,
    BreakExpression: BreakExpression,
    ContinueExpression: ContinueExpression
}