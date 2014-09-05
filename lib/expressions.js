
var contexts = require('./context');

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

function StructExpression(name) {
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
        
    if (headexpr.getName && headexpr.getName() == '_')
        isdefault = true;
    
    this.match = function (value) {
        if (isdefault)
            return true;
            
        return value == head;
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

module.exports = {
    ConstantExpression: ConstantExpression,
    QualifiedNameExpression: QualifiedNameExpression,
    StructExpression: StructExpression,
    MatchExpression: MatchExpression,
    PatternExpression: PatternExpression,
    NameExpression: NameExpression,
    AssignVariableExpression: AssignVariableExpression,
    LetExpression: LetExpression,
    FunctionExpression: FunctionExpression,
    ModuleExpression: ModuleExpression,
    EqualExpression: EqualExpression,
    NotEqualExpression: NotEqualExpression,
    LessExpression: LessExpression,
    GreaterExpression: GreaterExpression,
    LessEqualExpression: LessEqualExpression,
    GreaterEqualExpression: GreaterEqualExpression,
    AddExpression: AddExpression,
    SubtractExpression: SubtractExpression,
    MultiplyExpression: MultiplyExpression,
    DivideExpression: DivideExpression,
    ModExpression: ModExpression,
    BitwiseOrExpression: BitwiseOrExpression,
    BitwiseAndExpression: BitwiseAndExpression,
    AndExpression: AndExpression,
    OrExpression: OrExpression,
    CompositeExpression: CompositeExpression,
    ArgumentsExpression: ArgumentsExpression,
    CallExpression: CallExpression,
    IfExpression: IfExpression,
    ForExpression: ForExpression,
    WhileExpression: WhileExpression,
    LoopExpression: LoopExpression,
    ReturnExpression: ReturnExpression,
    BreakExpression: BreakExpression,
    ContinueExpression: ContinueExpression
}