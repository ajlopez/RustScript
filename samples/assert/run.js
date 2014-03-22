
var rustscript = require('../..'),
    fs = require('fs');
    
var text = fs.readFileSync(process.argv[2]).toString();

var context = rustscript.createContext();
context.defineLocalValue('assert!', function (result) {
    if (!result)
        throw "assertion failure";
});

var program = rustscript.compile(text, context);

var main = context.getLocalValue('main');

if (main)
    main();
    


