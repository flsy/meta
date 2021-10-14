import { setFieldValue } from '../utils';
import { isLeft } from 'fputils'

describe('setFieldValue', () => {
  it('set the value on simple path', () => {
    const form = [
      {
        type: 'text',
        name: "name",
      },
    ]

    expect(setFieldValue('name', 'Joe')(form).value).toEqual([{
      name: 'name',
      type: 'text',
      value: 'Joe',
    }]);
  });

  it('set the value on nested path', () => {
    const form = [{
        type: 'text',
        name: 'name.first',
      },
    ]

    expect(setFieldValue('name.first', 'Joe')(form).value).toEqual([{
        type: 'text',
        value: 'Joe',
        name: 'name.first',
      },
    ]);
  });

  it('set values on two fields', () => {
    const form = [
      {
        type: 'text',
        name: 'name',
      },
      {
        type: 'number',
        name: 'age',
      },
    ]

    const res1 = setFieldValue('name', 'Joe')(form);

    if(isLeft(res1)) {
      fail('Err!');
    }

    const res2 = setFieldValue('age', 32)(res1.value);

    expect(res1.value).toEqual([
      {
        name: 'name',
        type: 'text',
        value: 'Joe',
      },
      {
        name: 'age',
        type: 'number',
      },
    ]);

    expect(res2.value).toEqual([{
        name: 'name',
        type: 'text',
        value: 'Joe',
      },
      {
        name: 'age',
        type: 'number',
        value: 32,
      },
    ]);
  });
});
