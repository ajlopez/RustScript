
var simplegrammar = require('simplegrammar');
var expressions = require('./expressions');

var get = simplegrammar.get;
var peek = simplegrammar.peek;

var QualifiedNameExpression = expressions.QualifiedNameExpression,
    AssignVariableExpression = expressions.AssignVariableExpression,
    FunctionExpression = expressions.FunctionExpression,
    ModExpression = expressions.ModExpression,
    BitwiseOrExpression = expressions.BitwiseOrExpression,
    BitwiseAndExpression = expressions.BitwiseAndExpression,
    AndExpression = expressions.AndExpression,
    OrExpression = expressions.OrExpression,
    CompositeExpression = expressions.CompositeExpression,
    ArgumentsExpression = expressions.ArgumentsExpression,
    CallExpression = expressions.CallExpression,
    IfExpression = expressions.IfExpression,
    ForExpression = expressions.ForExpression,
    WhileExpression = expressions.WhileExpression,
    LoopExpression = expressions.LoopExpression,
    ReturnExpression = expressions.ReturnExpression,
    BreakExpression = expressions.BreakExpression,
    ContinueExpression = expressions.ContinueExpression;

var rules = [
    get([' ','\t','\r', '\n']).oneOrMore().skip(),
    get('/').and('/').upTo('\n').skip(),
    
    // Integer
    get('0-9').oneOrMore().and(get('i').zeroOrMore()).generate('Integer', function (value) { return expressions.constant(parseInt(value)) }),
        
    // Booleans
    get('true').generate('Name', function (value) { return expressions.constant(true); }),
    get('false').generate('Name', function (value) { return expressions.constant(false); }),
    
    // Name
    get(['a-z', 'A-Z']).oneOrMore().and(get('!').zeroOrMore()).generate('Name', function (value) { return expressions.name(value) }),
    get('_').generate('Name', function (value) { return expressions.name(value) }),
    
    get('"~"').generate('String', function (value) { return expressions.constant(value); }),
    
    // Separators    
    get('(').generate('LeftPar'),
    get(')').generate('RightPar'),
    get('[').generate('LeftBracket'),
    get(']').generate('RightBracket'),
    get('{').generate('LeftHandlebar'),
    get('}').generate('RightHandlebar'),
    get(';').generate('SemiColon'),
    get(',').generate('Comma'),

    // Operators
    get('->').generate('RightArrow'),
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
    get('=>').generate('RightFatArrow'),
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
        function (values) { return new expressions.module(values[1].getName(), values[3]); }),
        
    // Let
    get('let', 'mut', 'Name', 'Assign', 'Expression').generate('Expression', function (values) { return expressions.let(values[1].getName(), values[3], true); }),
    get('let', 'Name', 'Assign', 'Expression').generate('Expression', function (values) { return expressions.let(values[1].getName(), values[3], false); }),
        
    // Return
    get('return', 'Expression').generate('Expression', function (values) { return new ReturnExpression(values[1]); }),
    get('return').generate('Expression', function (values) { return new ReturnExpression(null); }),
    
    // Break
    get('break').generate('Expression', function (values) { return new BreakExpression(null); }),
    
    // Break
    get('continue').generate('Expression', function (values) { return new ContinueExpression(null); }),
    
    // Bracket Expression (while, if, loop, ... )
    get('BracketExpression').generate('Expression'),

    get('MatchExpression').generate('Expression'),
    get('StructExpression').generate('Expression'),
    get('EnumExpression').generate('Expression'),
        
    // While
    get('while', 'Expression', 'LeftHandlebar', 'CompositeExpression', 'RightHandlebar').generate('BracketExpression', function (values) { return new WhileExpression(values[1], values[3]); }),

    // Match
    get('match', 'Expression', 'LeftHandlebar', 'PatternList', 'RightHandlebar').generate('MatchExpression', function (values) { return expressions.match(values[1], values[3]); }),

    // Struct, Enum
    get('struct', 'Name', 'LeftHandlebar', 'NameList', 'RightHandlebar').generate('StructExpression', function (values) { return expressions.struct(values[1].getName(), values[3]); }),
    get('enum', 'Name', 'LeftHandlebar', 'NameList', 'RightHandlebar').generate('EnumExpression', function (values) { return expressions.enum(values[1].getName(), values[3]); }),
    get('Name', 'Comma', 'NameList').generate('NameList', function (values) { var list = values[2]; list.unshift(values[0]); return list; }),
    get('Name', peek('RightHandlebar')).generate('NameList', function (values) { return [ values[0] ] }),
    peek('RightHandlebar').generate('NameList', function (values) { return [] }),
        
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

    // Pattern List
    peek('RightHandlebar').generate('PatternList', function (values) { return [] }),
    get('Pattern', peek('RightHandlebar')).generate('PatternList', function (values) { return [ values[0] ]; }),
    get('Pattern', 'Comma', 'PatternList').generate('PatternList', function (values) { var list = values[2]; list.unshift(values[0]); return list; }),
    
    // Pattern
    get('Expression', 'RightFatArrow', 'Expression').generate('Pattern', function (values) { return expressions.pattern(values[0], values[2]); }),

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
    get('Expression4', 'Equal', 'Expression3').generate('Expression4', function (values) { return expressions.equal(values[0], values[2]); }),
    get('Expression4', 'NotEqual', 'Expression3').generate('Expression4', function (values) { return expressions.notEqual(values[0], values[2]); }),
    get('Expression4', 'LessEqual', 'Expression3').generate('Expression4', function (values) { return expressions.lessEqual(values[0], values[2]); }),
    get('Expression4', 'GreaterEqual', 'Expression3').generate('Expression4', function (values) { return expressions.greaterEqual(values[0], values[2]); }),
    get('Expression4', 'Less', 'Expression3').generate('Expression4', function (values) { return expressions.less(values[0], values[2]); }),
    get('Expression4', 'Greater', 'Expression3').generate('Expression4', function (values) { return expressions.greater(values[0], values[2]); }),
    
    // Bitwise Or Expression Level 3
    get('Expression3').generate('Expression4'),
    get('Expression3', 'BitwiseOr', 'Expression2').generate('Expression3', function (values) { return new BitwiseOrExpression(values[0], values[2]); }),

    // Bitwise And Expression Level 2
    get('Expression2').generate('Expression3'),
    get('Expression2', 'BitwiseAnd', 'Expression1').generate('Expression2', function (values) { return new BitwiseAndExpression(values[0], values[2]); }),
    
    // Expression Level 1
    get('Expression1').generate('Expression2'),
    get('Expression1', 'Plus', 'Expression0').generate('Expression1', function (values) { return expressions.add(values[0], values[2]); }),
    get('Expression1', 'Minus', 'Expression0').generate('Expression1', function (values) { return expressions.subtract(values[0], values[2]); }),
    
    // Expression Level 0
    get('Expression0').generate('Expression1'),
    get('Expression0', 'Multiply', 'Term').generate('Expression0', function (values) { return expressions.multiply(values[0], values[2]); }),
    get('Expression0', 'Divide', 'Term').generate('Expression0', function (values) { return expressions.divide(values[0], values[2]); }),
    get('Expression0', 'Module', 'Term').generate('Expression0', function (values) { return new ModExpression(values[0], values[2]); }),

    // Term
    get('Term').generate('Expression0'),
    get('LeftBracket', 'ArgumentList', 'RightBracket').generate('Term', function (values) { return expressions.array(values[1]); }),
    get('LeftPar', 'Expression', 'RightPar').generate('Term', function (values) { return values[1]; }),
    get('LeftPar', 'ArgumentList', 'RightPar').generate('Term', function (values) { return expressions.tuple(values[1]); }),
    get('Term', 'LeftPar', 'Arguments', 'RightPar').generate('Term', function (values) { return new CallExpression(values[0], values[2]); }),
    peek('RightPar').generate('ArgumentList', function (values) { return [] }),
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
    get('Expression', peek('RightBracket')).generate('ArgumentList', function (values) { return [ values[0] ]; }),
    peek('RightPar').generate('ArgumentList', function (value) { return []; }),
    peek('RightBracket').generate('ArgumentList', function (value) { return []; }),
];

function createParser(text) {
    return simplegrammar.createParser(text, rules);    
}

module.exports = {
    createParser: createParser
};
