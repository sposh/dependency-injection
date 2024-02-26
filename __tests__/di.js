import diCreator from '..';

const di = diCreator(new Map([
    [Array, new Map([
        ['EmptyArray', [Array]],
        ['EmptyArray2', [async () => (await import('../assets/ExternalArray')).default]],
        ['Array', [Array, true, 'one', 'two']],
        ['Array2', [async () => (await import('../assets/ExternalArray')).default, true, 'three', 'four']],
        ['EmptyArray3', [Array, false]],
        ['EmptyArray4', [async () => (await import('../assets/ExternalArray')).default, false]],
        ['Array3', [Array, false, 'one', 'two']],
        ['Array4', [async () => (await import('../assets/ExternalArray')).default, false, 'three', 'four']],
    ])],
    [Map, new Map([
        ['EmptyArray', [Map]],
    ])],
]));

test('Basic DI', async () => {
    expect(di(Array)('EmptyArray') instanceof Array).toBe(true);
    expect(di(Array)('EmptyArray') instanceof Map).toBe(false);
    expect(di(Map)('EmptyArray') instanceof Array).toBe(false);
    expect(di(Map)('EmptyArray') instanceof Map).toBe(true);
    expect(di(Array)('EmptyArray')).toEqual(new Array());
    expect(di(Array)('EmptyArray').length).toEqual(0);
    expect(di(Array)('EmptyArray')).not.toEqual(di(Array)('Array'));
    expect(di(Array)('EmptyArray')).not.toEqual(di(Array)('Array2'));
    expect(di(Array)('EmptyArray')).not.toEqual(di(Array)('EmptyArray2'));
    expect(di(Array)('EmptyArray2').length).toEqual(0);
    expect(di(Array)('EmptyArray2')).not.toEqual(di(Array)('Array'));
    expect(di(Array)('EmptyArray2')).not.toEqual(di(Array)('Array2'));
    expect(di(Array)('Array')).toEqual(new Array('one', 'two'));
    expect(di(Array)('Array').length).toEqual(2);
    expect(di(Array)('Array').at(0)).toEqual('one');
    expect(di(Array)('Array').at(1)).toEqual('two');
    expect(di(Array)('Array')).not.toEqual(di(Array)('Array2'));
    expect(typeof di(Array)('Array2').at(0).then).toEqual('function');
    expect(typeof di(Array)('Array2').at(1).then).toEqual('function');
    expect(await di(Array)('Array2').at(0)).toEqual('three');
    expect(await di(Array)('Array2').at(1)).toEqual('four');
});

test('DI singleton-ness', async () => {
    expect(di(Array)('EmptyArray')).toBe(di(Array)('EmptyArray'));
    expect(di(Array)('EmptyArray')).not.toBe(new Array());
    di(Array)('EmptyArray')[0] = 'one';
    expect(di(Array)('EmptyArray').length).toEqual(1);
    expect(di(Array)('EmptyArray').at(0)).toEqual('one');
    di(Array)('EmptyArray').push('EmptyArray');
    expect(di(Array)('EmptyArray').length).toEqual(2);
    expect(di(Array)('EmptyArray').at(1)).toEqual('EmptyArray');
    expect(di(Array)('EmptyArray2')).toBe(di(Array)('EmptyArray2'));
    await di(Array)('EmptyArray2').push('EmptyArray2');
    expect(await di(Array)('EmptyArray2').at(0)).toEqual('EmptyArray2');
    expect(di(Array)('Array')).toBe(di(Array)('Array'));
    expect(di(Array)('Array')).not.toBe(new Array('one', 'two'));
    di(Array)('Array')[1] = 'two_b';
    expect(di(Array)('Array').at(1)).toEqual('two_b');
    di(Array)('Array').push('Array');
    expect(di(Array)('Array').length).toEqual(3);
    expect(di(Array)('Array').at(2)).toEqual('Array');
    expect(di(Array)('Array2')).toBe(di(Array)('Array2'));
    await di(Array)('Array2').fill('four_b', 1, 2);
    expect(await di(Array)('Array2').at(1)).toEqual('four_b');
    await di(Array)('Array2').push('Array2');
    expect(await di(Array)('Array2').at(2)).toEqual('Array2');
});

test('DI distributed singleton-ness', async () => {
    expect(di(Array)('EmptyArray').at(0)).toEqual('one');
    expect(di(Array)('EmptyArray').length).toEqual(2);
    expect(di(Array)('EmptyArray').at(1)).toEqual('EmptyArray');
    expect(await di(Array)('EmptyArray2').at(0)).toEqual('EmptyArray2');
    expect(di(Array)('Array').at(1)).toEqual('two_b');
    expect(di(Array)('Array').length).toEqual(3);
    expect(di(Array)('Array').at(2)).toEqual('Array');
    expect(await di(Array)('Array2').at(1)).toEqual('four_b');
    expect(await di(Array)('Array2').at(2)).toEqual('Array2');
});

test('DI non-singleton-ness', async () => {
    expect(di(Array)('EmptyArray3')).not.toBe(di(Array)('EmptyArray3'));
    expect(di(Array)('EmptyArray3')).toEqual(di(Array)('EmptyArray3'));
    expect(di(Array)('EmptyArray3')).not.toBe(new Array());
    expect(di(Array)('EmptyArray3')).toEqual(new Array());
    di(Array)('EmptyArray3')[0] = 'one';
    expect(di(Array)('EmptyArray3').at(0)).toEqual(undefined);
    di(Array)('EmptyArray3').push('EmptyArray3');
    expect(di(Array)('EmptyArray3').length).toEqual(0);
    expect(di(Array)('EmptyArray4')).not.toBe(di(Array)('EmptyArray4'));
    expect(di(Array)('EmptyArray4').toString()).toEqual(di(Array)('EmptyArray4').toString());
    await di(Array)('EmptyArray4').push('EmptyArray4');
    expect(await di(Array)('EmptyArray4').at(0)).toEqual(undefined);
    expect(di(Array)('Array3')).not.toBe(di(Array)('Array3'));
    expect(di(Array)('Array3')).toEqual(di(Array)('Array3'));
    expect(di(Array)('Array3')).not.toBe(new Array('one', 'two'));
    expect(di(Array)('Array3')).toEqual(new Array('one', 'two'));
    di(Array)('Array3')[1] = 'two_b';
    expect(di(Array)('Array3').at(1)).toEqual('two');
    di(Array)('Array3').push('Array3');
    expect(di(Array)('Array3').length).toEqual(2);
    expect(di(Array)('Array4')).not.toBe(di(Array)('Array4'));
    expect(di(Array)('Array4').toString()).toEqual(di(Array)('Array4').toString());
    await di(Array)('Array4').fill('four_b', 1, 2);
    expect(await di(Array)('Array4').at(1)).toEqual('four');
    await di(Array)('Array4').push('Array4');
    expect(await di(Array)('Array4').at(3)).toEqual(undefined);
});