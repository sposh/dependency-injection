// TODO: createFromPrototype to also overwrite getters, setters & properties
// TODO: Use decorators/babel (also for logger, and logger as DI)
import { createFromPrototype } from '@sposh/oop-utils';

export default function di(config, parentKey) { // Only one key (last) of each config key-tree per entry can be String, anything after is ignored
    const resolvedConfig = new Map();
    config.forEach((value, key) => {
        let resolvedValue;
        if (typeof key === 'string') {
            if (value instanceof Array) {
                if (value[1] === false) {
                    resolvedValue = () => createFromPrototype(parentKey, resolver(value[0]), ...value.slice(2));
                } else {
                    resolvedValue = createFromPrototype(parentKey, resolver(value[0]), ...value.slice(2));
                }
            } // else resolvedValue stays undefined
        } else {
            resolvedValue = di(value, key);
        }
        resolvedConfig.set(key, resolvedValue);
    });
    return key => {
        const value = resolvedConfig.get(key);
        if (!value && typeof key !== 'string') {
            return () => value;
        }
        return value?.name === 'resolvedValue' ? value() : value;
    }
}

function resolver(resolverOrResolved) {
    return typeof resolverOrResolved === 'function' && resolverOrResolved.prototype === undefined ? resolverOrResolved : () => resolverOrResolved;
}