
function Context(parent) {
    const values = { };
    const mutables = { };
    const publics = { };
    
    this.hasLocalValue = function (name) {
        return values.hasOwnProperty(name);
    };
    
    this.hasPublicValue = function (name) {
        if (!publics[name])
            return false;
            
        return values.hasOwnProperty(name);
    };
    
    this.getLocalValue = function (name) {
        return values[name];
    };
    
    this.getPublicValue = function (name) {
        if (!publics[name])
            return null;
            
        return values[name];
    };
    
    this.defineLocalValue = function (name, value, options) {
        values[name] = value;
        
        if (options && options.mutable)
            mutables[name] = true;
        if (options && options.public)
            publics[name] = true;
    };
    
    this.setValue = function (name, value) {
        if (!values.hasOwnProperty(name))
            if (parent)
                return parent.setValue(name, value);
            else
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