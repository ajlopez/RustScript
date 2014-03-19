
function Context(parent) {
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
    
    this.getValue = function (name) {
        if (values.hasOwnProperty(name))
            return values[name];
            
        if (parent)
            return parent.getValue(name);
            
        return null;
    };
}

function createContext(parent) {
    return new Context(parent);
}

module.exports = {
    createContext: createContext
};