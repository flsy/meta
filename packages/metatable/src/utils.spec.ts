import {isFiltered} from './index';

describe('metatable', () => {
    it('works', () => {
        expect(isFiltered({}, {name: 'name', type: 'string' })).toEqual(false);
    });
});