import diCreator from '../index.js';

export default class ExternalArray extends Array {}

const iface = {
    f1: () => {},
    f2: () => {},
};

export const itation = {
    f1: () => 'f1',
    f2: () => 'f2',
    f3: () => 'f3',
};

export const badItation = {
    f1: () => 'f1bad',
};

export const di = diCreator(new Map([
    [Array, new Map([
        ['EmptyArray', [ExternalArray]],
        ['EmptyArray2', [async () => (await import('./di.js')).default]],
        ['Array', [ExternalArray, true, 'one', 'two']],
        ['Array2', [async () => (await import('./di.js')).default, true, 'three', 'four']],
        ['EmptyArray3', [ExternalArray, false]],
        ['EmptyArray4', [async () => (await import('./di.js')).default, false]],
        ['Array3', [ExternalArray, false, 'one', 'two']],
        ['Array4', [async () => (await import('./di.js')).default, false, 'three', 'four']],
    ])],
    [Map, new Map([
        ['EmptyArray', [Map]],
    ])],
    [Object, new Map([
        ['Array', [String]],
        [Object, new Map([
            ['Array', [Map]],
            ['Undefined'],
        ])],
        ['Object', new Map([
            ['Array', [Object]],
        ])],
    ])],
    [iface, new Map([
        ['itation', [itation]],
        ['itation2', [async () => (await import('./di.js')).itation]],
        ['badItation', [badItation]],
        ['badItation2', [async () => (await import('./di.js')).badItation]],
    ])],
    ['itation', [[iface, itation]]],
    ['itation2', [[iface, async () => (await import('./di.js')).itation]]],
]));

test('Basic DI', async () => {
    expect(di(Array)('EmptyArray') instanceof Array).toBe(true);
    expect(di(Array)('EmptyArray') instanceof Map).toBe(false);
    expect(di(Map)('EmptyArray') instanceof Array).toBe(false);
    expect(di(Map)('EmptyArray') instanceof Map).toBe(true);
    expect(di(Array)('EmptyArray').at(0)).toEqual(undefined);
    expect(await di(Array)('EmptyArray2').at(0)).toEqual(undefined);
    expect(di(Array)('Array').toString()).toEqual(['one', 'two'].toString());
    expect(di(Array)('Array').at(0)).toEqual('one');
    expect(di(Array)('Array').at(1)).toEqual('two');
    expect(await di(Array)('Array2').at(0)).toEqual('three');
    expect(await di(Array)('Array2').at(1)).toEqual('four');
    expect(di(iface)('itation').f2()).toEqual('f2');
    expect(await di(iface)('itation2').f2()).toEqual('f2');
    expect(di('itation').f2()).toEqual('f2');
    expect(await di('itation2').f2()).toEqual('f2');
});

test('DI levels & incorrectness', async () => {
    expect(di('')).toBe(undefined);
    expect(di()('')).toBe(undefined);
    expect(di(String)('')).toBe(undefined);
    expect(di(Array)('')).toBe(undefined);
    expect(di(Array)()('')).toBe(undefined);
    expect(di(Object)('Array') instanceof Object).toBe(true);
    expect(di(Object)(Object)('Array') instanceof Object).toBe(true);
    expect(di(Object)(Object)('Undefined')).toBe(undefined);
    expect(di(Object)(Array)('Array')).toBe(undefined);
    expect(di(Object)('Object')).toBe(undefined);
    // can't save you from trying di(Object)('Object')('Array')
    expect(di(iface)('itation').f3).toBe(undefined);
    expect(di(iface)('itation2').f3).toBe(undefined);
    try {
        di(iface)('badItation').f2();
        expect(true).toBe(false);
    } catch (error) {
        expect(error.message).toEqual('[@sposh/oop-utils]factory.createFromPrototype: expected basePrototype \'Object\' function \'f2\' not implemented in resolvedInstance \'Object\'');
    }
    try {
        await di(iface)('badItation2').f2();
        expect(true).toBe(false);
    } catch (error) {
        expect(error.message).toEqual('[@sposh/oop-utils]factory.createFromPrototype: expected basePrototype \'Object\' function \'f2\' not implemented in resolvedInstance \'Object\'');
    }
});

test('DI singleton-ness', async () => {
    expect(di).toBe((await import('./di.js')).di);
    expect(di(Array)('EmptyArray')).toBe(di(Array)('EmptyArray'));
    const emptyArray = di(Array)('EmptyArray');
    expect(emptyArray).toBe(di(Array)('EmptyArray'));
    emptyArray.push('one');
    expect(di(Array)('EmptyArray').at(0)).toEqual('one');
    emptyArray.push('EmptyArray');
    expect(di(Array)('EmptyArray').at(1)).toEqual('EmptyArray');
    expect(di(Array)('EmptyArray2')).toBe(di(Array)('EmptyArray2'));
    const emptyArray2 = di(Array)('EmptyArray2');
    expect(emptyArray2).toBe(di(Array)('EmptyArray2'));
    await emptyArray2.push('EmptyArray2');
    expect(await di(Array)('EmptyArray2').at(0)).toEqual('EmptyArray2');
    expect(di(Array)('Array')).toBe(di(Array)('Array'));
    const array = di(Array)('Array');
    expect(array).toBe(di(Array)('Array'));
    array.fill('two_b', 1, 2);
    expect(di(Array)('Array').at(1)).toEqual('two_b');
    array.push('Array');
    expect(di(Array)('Array').at(2)).toEqual('Array');
    expect(di(Array)('Array2')).toBe(di(Array)('Array2'));
    const array2 = di(Array)('Array2');
    expect(array2).toBe(di(Array)('Array2'));
    await array2.fill('four_b', 1, 2);
    expect(await di(Array)('Array2').at(1)).toEqual('four_b');
    await array2.push('Array2');
    expect(await di(Array)('Array2').at(2)).toEqual('Array2');
});

test('DI distributed singleton-ness', async () => {
    expect(di(Array)('EmptyArray').at(0)).toEqual('one');
    expect(di(Array)('EmptyArray').at(1)).toEqual('EmptyArray');
    expect(await di(Array)('EmptyArray2').at(0)).toEqual('EmptyArray2');
    expect(di(Array)('Array').at(1)).toEqual('two_b');
    expect(di(Array)('Array').at(2)).toEqual('Array');
    expect(await di(Array)('Array2').at(1)).toEqual('four_b');
    expect(await di(Array)('Array2').at(2)).toEqual('Array2');
});

test('DI non-singleton-ness', async () => {
    expect(di(Array)('EmptyArray3')).not.toBe(di(Array)('EmptyArray3'));
    di(Array)('EmptyArray3').push('one');
    expect(di(Array)('EmptyArray3').at(0)).toEqual(undefined);
    di(Array)('EmptyArray3').push('EmptyArray3');
    expect(di(Array)('EmptyArray4')).not.toBe(di(Array)('EmptyArray4'));
    await di(Array)('EmptyArray4').push('EmptyArray4');
    expect(await di(Array)('EmptyArray4').at(0)).toEqual(undefined);
    expect(di(Array)('Array3')).not.toBe(di(Array)('Array3'));
    di(Array)('Array3').fill('two_b', 1, 2);
    expect(di(Array)('Array3').at(1)).toEqual('two');
    di(Array)('Array3').push('Array3');
    expect(di(Array)('Array4')).not.toBe(di(Array)('Array4'));
    await di(Array)('Array4').fill('four_b', 1, 2);
    expect(await di(Array)('Array4').at(1)).toEqual('four');
    await di(Array)('Array4').push('Array4');
    expect(await di(Array)('Array4').at(3)).toEqual(undefined);
});