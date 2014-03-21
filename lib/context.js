
function Context(parent) {
    var values = { };
    var mutables = { };
    
    this.hasLocalValue = function (name) {
        return values.hasOwnProperty(name);
    };
    
    this.getLocalValue = function (name) {
        return values[name];
    };
    
    this.defineLocalValue = function (name, value, mutable) {
        values[name] = value;
        
        if (mutable)
            mutables[name] = true;
    };
    
    this.setLocalValue = function (name, value) {
        if (!values.hasOwnProperty(name))
            throw "undefined '" + name + "'";
            
        if (!mutables.hasOwnProperty(name))
            throw "immutable '" + name + "'";
            
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