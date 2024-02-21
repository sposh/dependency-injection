import diCreator from '..';

test('Basic DI', async () => {
    const di = diCreator(new Map([
        [Array, new Map([
            ['Array', [Array, 'one', 'two']],
            ['Array2', [import('../assets/ExternalArray').then(m => m.default), 'three', 'four']],
        ])],
    ]));
    expect(di(Array)('Array')).toBe(di(Array)('Array'));
    expect(di(Array)('Array')).not.toBe(new Array('one', 'two'));
    expect(di(Array)('Array')).toEqual(new Array('one', 'two'));
    expect(di(Array)('Array').length).toEqual(2);
    expect(di(Array)('Array').at(0)).toEqual('one');
    expect(di(Array)('Array').at(1)).toEqual('two');
    expect(di(Array)('Array')).not.toEqual(di(Array)('Array2'));
    expect(di(Array)('Array2')).toBe(di(Array)('Array2'));
    expect(di(Array)('Array2')).not.toEqual(new Array('three', 'four'));
    expect(typeof di(Array)('Array2').at(0).then).toEqual('function');
    expect(typeof di(Array)('Array2').at(1).then).toEqual('function');
    expect(await di(Array)('Array2').at(0)).toEqual('three');
    expect(await di(Array)('Array2').at(1)).toEqual('four');
});