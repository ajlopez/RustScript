
var parsers = require('../lib/parser');

exports['parse integer number'] = function (test) {
    var parser = parsers.createParser('123');
    
    var result = parser.parse("Integer");
    
    test.ok(result);
    test.equal(result.value.evaluate(null), 123);
    test.equal(result.type, "Integer");
    
    test.equal(parser.parse("Integer"), null);    
};