
var fs = require('fs');
var rustscript = require('../..');
    
var text = fs.readFileSync(process.argv[2]).toString();

var context = rustscript.createContext();
context.defineLocalValue('println!', console.log);

var program = rustscript.compile(text, context);

var main = context.getLocalValue('main');

if (main)
    main();
    


