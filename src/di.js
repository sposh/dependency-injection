// TODO: Change values from arrays to objects
// TODO: Use decorators once supported nativelly by Node (no need to pre-transpile with Babel)
import { createFromPrototype } from '@sposh/oop-utils';

export default function di(config, parentKey) { // Only one key (last) of each config key-tree per entry can be String, anything after is ignored
    const resolvedConfig = new Map();
    return key => {
        let resolvedValue = resolvedConfig.get(key);
        if (!resolvedValue) {
            const value = config.get(key);
            if (value) {
                if (typeof key === 'string') {
                    if (value instanceof Array) {
                        if (value[1] === false) {
                            resolvedValue = () => parentKey ? createFromPrototype(parentKey, resolver(value[0]), ...value.slice(2)) : createFromPrototype(value[0][0], resolver(value[0][1]), ...value.slice(2));
                        } else {
                            resolvedValue = parentKey ? createFromPrototype(parentKey, resolver(value[0]), ...value.slice(2)) : createFromPrototype(value[0][0], resolver(value[0][1]), ...value.slice(2));
                        }
                    } // else resolvedValue stays undefined
                } else {
                    resolvedValue = di(value, key);
                }
                resolvedConfig.set(key, resolvedValue);
            }
        }
        if (!resolvedValue && typeof key !== 'string') {
            return () => resolvedValue;
        }
        return resolvedValue?.name === 'resolvedValue' ? resolvedValue() : resolvedValue;
    }
}

function resolver(resolverOrResolved) {
    return typeof resolverOrResolved === 'function' && resolverOrResolved.prototype === undefined ? resolverOrResolved : () => resolverOrResolved;
}