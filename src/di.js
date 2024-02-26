// TODO: Use Symbols
// TODO: DTO - freeze vs getters & simplify toString
// TODO: createFromPrototype to also overwrite getters, setters & properties
// TODO: Use decorators/babel (also for logger, and logger as DI)
import { createFromPrototype } from '@sposh/oop-utils';

export default function di(config, parentKey) {
    const resolvedConfig = new Map();
    config.forEach((value, key) => {
        let resolvedValue;
        if (typeof key === 'string') {
            if (value[1] === false) {
                resolvedValue = () => createFromPrototype(parentKey, resolver(value[0]), ...value.slice(2));
            } else {
                resolvedValue = createFromPrototype(parentKey, resolver(value[0]), ...value.slice(2));
            }
        } else {
            resolvedValue = di(value, key);
        }
        resolvedConfig.set(key, resolvedValue);
    });
    return key => {
        const value = resolvedConfig.get(key);
        return value.name === 'resolvedValue' ? value() : value;
    }
}

function resolver(resolverOrResolved) {
    return typeof resolverOrResolved === 'function' && resolverOrResolved.prototype === undefined ? resolverOrResolved : () => resolverOrResolved;
}