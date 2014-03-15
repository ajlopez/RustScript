
var simplegrammar = require('simplegrammar');

var get = simplegrammar.get;
var peek = simplegrammar.peek;

function IntegerExpression(text) {
    var value = parseInt(text);
    
    this.evaluate = function () {
        return value;
    };
}

var rules = [
    get([' ','\t','\r']).oneOrMore().skip(),
    get('0-9').oneOrMore().generate('Integer', function (value) { return new IntegerExpression(value) }),
];

function createParser(text) {
    return simplegrammar.createParser(text, rules);    
}

module.exports = {
    createParser: createParser
};
