import { instanceToString } from './utils';

/**
 * Base class for data transfer objects.
 */
export default class BaseDto {
    #params;

    constructor(...params) {
        this.#params = params;
    }

    get _params() {
        return [...this.#params]; // ensure immutability
    }

    toString() {
        return instanceToString(this);
    }
}

/**
 * Mixin to generate class of a collection of data transfer objects.
 */
export function collectionDtoMixin(dtoClass = BaseDto) {
    return class CollectionDto extends BaseDto {
        #dtoClass;
        #elements;
    
        constructor(...params) {
            super(params);
            this.#dtoClass = dtoClass; // TODO Check class extends BaseDto
            this.#elements = params[0].map(elementParams => createInstance(this.#dtoClass, ...elementParams));
        }
    
        get(i) {
            return this.#elements[i];
        }
    
        get iterator() {
            return this.#elements.values();
        }
    
        toString() {
            return `${this.#dtoClass.name}Collection[${this.#elements}]`;
        }
    }
}