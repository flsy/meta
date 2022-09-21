import { setFieldProperty } from '../utils';
import {getTextMeta} from '../helpers';

describe('setFieldProperty', () => {
  it('set options', () => {
    const form = [
      getTextMeta({
        name: 'name',
      }),
    ];

    expect(setFieldProperty('options', 'name', [ 'a', 'b', 'c'], form)).toEqual([{
      name: 'name',
      type: 'text',
      options: ['a', 'b', 'c'],
    }]);
  });
  it('set random property', () => {
    const form = [
      getTextMeta({
        name: 'name',
      }),
    ];

    expect(setFieldProperty('random', 'name',{ a: { b: 'c' }}, form)).toEqual([{
      name: 'name',
      type: 'text',
      random: { a: { b: 'c' }}
    }]);
  });
});
