
const parsers = require('../lib/parser');

function evaluate(text, test) {
    const parser = parsers.createParser(text);
    const expr = parser.parse('Expression');
    const value = expr.value.evaluate(null);
    
    if (test)
        test.equal(parser.next(), null);
        
    return value;
};

exports['parse and evaluate or'] = function (test) {
    test.strictEqual(evaluate('false || false', test), false); 
    test.strictEqual(evaluate('false || true', test), true); 
    test.strictEqual(evaluate('true || true', test), true); 
    test.strictEqual(evaluate('false || false', test), false); 
};

exports['parse and evaluate and'] = function (test) {
    test.strictEqual(evaluate('false && false', test), false); 
    test.strictEqual(evaluate('false && true', test), false); 
    test.strictEqual(evaluate('true && true', test), true); 
    test.strictEqual(evaluate('false && false', test), false); 
};

exports['parse and evaluate and or'] = function (test) {
    test.strictEqual(evaluate('true || false && false', test), true); 
    test.strictEqual(evaluate('false && true || true', test), true); 
    test.strictEqual(evaluate('false && true || false', test), false); 
    test.strictEqual(evaluate('false || true && true', test), true); 
    test.strictEqual(evaluate('true || false && false', test), true); 
};

