import { isFiltered, toFilterValues, toFilters } from '..';

describe('metatable', () => {
  describe('isFiltered', () => {
    it('works', () => {
      expect(isFiltered({}, {name: 'name', type: 'string' })).toEqual(false);
    });
  });
  describe('toFilterValues', () => {
    it('works', () => {
      expect(toFilterValues({
        autor: {
          type: 'string',
          filters: [{ value: 'X', operator: 'EQ'}]
        },
        system :{
          type: 'strings',
          filters: [{value: '4'}, {value: '5'}]
        },
        time: {
          type: 'number',
          filters: [
            { value: 1662452997, operator: 'GT' },
            { value: 1663403399, operator: 'LT' }
          ]
        },
        isOk: {
          type: 'boolean',
          value: false
        }
      })).toEqual({
        autor: {
          operator: 'EQ',
          value: 'X'
        },
        system: {
          value: ['4', '5']
        },
        time: {
          value: [1662452997, 1663403399]
        },
        isOk: {
          value: false
        }
      });
    });
  });

  describe('toFilters test', () => {
    expect(toFilters({name: 'createdBy', type: 'string'}, {operator: undefined, value: ''} )).toEqual({createdBy: {filters: [{operator: undefined, value: null}], type: 'string'}});
  });
}); 


