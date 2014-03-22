
var parsers = require('../lib/parser');

function evaluate(text, test) {
    var parser = parsers.createParser(text);
    var expr = parser.parse('Expression');
    var value = expr.value.evaluate(null);
    
    if (test)
        test.equal(parser.next(), null);
        
    return value;
};

exports['parse and evaluate bit wise or'] = function (test) {
    test.equal(evaluate('1 | 2', test), 3); 
};
