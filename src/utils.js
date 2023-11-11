// TODO JSDoc

/**
 * Generic conversion of an instance into a string using it's getters and it's property values
 */
 export function instanceToString(instance) {
    let gettersString = getAllGetterNames(instance).reduce((acc, curr) => `${acc}${curr}: ${instance[curr]}, `, '');
    let jsonString = JSON.stringify(instance, (key, value) => {
        if (key.indexOf('_') !== 0) {
            return value;
        }
    });
    if (gettersString.length <= 0 || jsonString.length <= 2) {
        gettersString = gettersString.substring(0, gettersString.length - 2);
    }
    if (jsonString) {
        jsonString = jsonString.substring(1);
    } else {
        jsonString = '}';
    }
    return `${instance.constructor.name}{${gettersString}${jsonString}`;
}