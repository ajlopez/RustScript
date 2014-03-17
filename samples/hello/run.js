
var rustscript = require('../..'),
    fs = require('fs');
    
var text = fs.readFileSync(process.argv[2]).toString();

var context = rustscript.createContext();
context.setLocalValue('println', console.log);

var program = rustscript.compile(text, context);

var main = context.getLocalValue('main');

if (main)
    main();
    


