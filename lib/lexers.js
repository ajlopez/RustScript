
const gelex = require('gelex');
const ldef = gelex.definition();

const TokenType = { Name: 'name', Integer: 'integer', String: 'string', Delimiter: 'delimiter', Punctuation: 'punctuation' };

ldef.define(TokenType.Integer, '[0-9][0-9]*');
ldef.define(TokenType.Name, '[a-zA-Z_][a-zA-Z0-9_]*');
ldef.define(TokenType.Delimiter, '(){}[]'.split(''));
ldef.define(TokenType.Punctuation, '+-*/<>=!;:,.me'.split(''));
ldef.define(TokenType.Punctuation, '<= >= == !='.split(' '));
ldef.define(TokenType.Punctuation, '|| &&'.split(' '));
ldef.defineText(TokenType.String, '"', '"',
    {
        escape: '\\',
        escaped: { 'n': '\n', 'r': '\r', 't': '\t' }
    }
);
ldef.defineComment('/*', '*/');
ldef.defineComment('//');

function createLexer(text) {
    return ldef.lexer(text);
}

module.exports = {
    lexer: createLexer,
    TokenType: TokenType
}

