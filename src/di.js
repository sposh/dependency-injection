import { createFromPrototype } from '@sposh/oop-utils'

export default function di(config, parentKey) {
    const resolvedConfig = new Map();
    config.forEach((value, key) => {
        resolvedConfig.set(key, typeof key === 'string' ? createFromPrototype(parentKey, value[0], ...value.slice(1)) : di(value, key));
    });
    return key => resolvedConfig.get(key);
}