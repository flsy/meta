import { fieldPropertyLens } from '../utils';
import { isLeft } from 'fputils'
import { set } from 'ramda'

const form = [
  {
    type: 'myField',
    name: 'field1',
    options: [],
  },
]

describe('fieldPropertyLens', () => {
  it('set options on simple path', () => {
    const options = [{ value: 15, label: 'my label' }];

    const lens = fieldPropertyLens( 'options', 'field1')(form);

    if(isLeft(lens)) {
      fail(lens.value)
    }

    expect(set(lens.value, options, form)).toEqual([
      {
        name: 'field1',
        type: 'myField',
        options,
      },
    ]);
  });
});