
var parsers = require('../lib/parser');

function evaluate(text, test) {
    var parser = parsers.createParser(text);
    var expr = parser.parse('Expression');
    var value = expr.value.evaluate(null);
    
    if (test)
        test.equal(parser.next(), null);
        
    return value;
};

exports['parse and evaluate bitwise or'] = function (test) {
    test.equal(evaluate('1 | 2', test), 3); 
};

exports['parse and evaluate bitwise and'] = function (test) {
    test.equal(evaluate('7 & 5', test), 5); 
    test.equal(evaluate('1 & 2', test), 0); 
    test.equal(evaluate('7 & 3', test), 3); 
    test.equal(evaluate('7 & 11', test), 3); 
};

exports['parse and evaluate bitwise and/or'] = function (test) {
    test.equal(evaluate('4 | 7 & 5', test), 5); 
    test.equal(evaluate('1 & 2 | 5', test), 5); 
    test.equal(evaluate('4 | 7 & 3', test), 7); 
    test.equal(evaluate('4 | 7 & 11', test), 7); 
};
