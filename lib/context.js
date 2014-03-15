
function Context() {
    var values = { };
    
    this.hasLocalValue = function (name) {
        return values.hasOwnProperty(name);
    };
    
    this.getLocalValue = function (name) {
        return values[name];
    };
    
    this.setLocalValue = function (name, value) {
        values[name] = value;
    };
}

function createContext() {
    return new Context();
}

module.exports = {
    createContext: createContext
};