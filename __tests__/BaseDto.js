import BaseDto from '../src/BaseDto';

test('Basic BaseDto', () => {
    const baseDto = new BaseDto();
    expect(baseDto.toString()).toBe('BaseDto{}');
    expect(baseDto._params).toEqual([]);
});

test('BaseDto with params', () => {
    const baseDto = new BaseDto('a', 'b');
    expect(baseDto.toString()).toBe('BaseDto{}');
    expect(baseDto._params).toEqual(['a', 'b']);
});

test('BaseDto params inmutability', () => {
    const baseDto = new BaseDto('a', 'b');
    try {
        baseDto._params[0] = 'c';
    } catch (error) {
        // ignore        
    }
    expect(baseDto._params).toEqual(['a', 'b']);
});

test('Extending BaseDto', () => {
    const extendedDto = new class ExtendedDto extends BaseDto {
        #one;
        constructor(one) {
            super(one);
            this.#one = one;
        }
        get one() {
            return this.toInmutable(this.#one);
        }
    }(1);
    expect(extendedDto.toString()).toBe('ExtendedDto{one: 1}');
    expect(extendedDto.one).toBe(1);
    expect(extendedDto._params).toEqual([1]);
});

test('toInmutable with different types of parameters', () => {
    const extendedDto = new class ExtendedDto extends BaseDto {
        #anArray = ['a'];
        #anObject = { v: 'o' };
        get anArray() {
            return this.toInmutable(this.#anArray);
        }
        get anObject() {
            return this.toInmutable(this.#anObject);
        }
    }();
    try {
        extendedDto.anArray[0] = 'b';
    } catch (error) {
        // ignore        
    }
    expect(extendedDto.anArray[0]).toBe('a');
    try {
        extendedDto.anObject.v = 'p';
    } catch (error) {
        // ignore        
    }
    expect(extendedDto.anObject.v).toBe('o');
});

test('toShallowCopy with different types of parameters', () => {
    const extendedDto = new class ExtendedDto extends BaseDto {
        #anArray = ['a'];
        #anObject = { v: 'o' };
        get anArray() {
            return this.toShallowCopy(this.#anArray);
        }
        get anObject() {
            return this.toShallowCopy(this.#anObject);
        }
    }();
    extendedDto.anArray[0] = 'b';
    expect(extendedDto.anArray[0]).toBe('a');
    extendedDto.anObject.v = 'p';
    expect(extendedDto.anObject.v).toBe('o');
});