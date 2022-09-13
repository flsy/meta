import { setFieldValue } from '../utils';
import {MetaField} from "@falsy/metacore";

describe('setFieldValue', () => {
  it('set the value on simple path', () => {
    const form: MetaField[] = [
      {
        type: 'text',
        name: "name",
      },
    ]

    expect(setFieldValue('name', 'Joe')(form)).toEqual([{
      name: 'name',
      type: 'text',
      value: 'Joe',
    }]);
  });

  it('set the value on nested path', () => {
    const form: MetaField[] = [{
        type: 'text',
        name: 'name.first',
      },
    ]

    expect(setFieldValue('name.first', 'Joe')(form)).toEqual([{
        type: 'text',
        value: 'Joe',
        name: 'name.first',
      },
    ]);
  });

  it('set values on two fields', () => {
    const form: MetaField[] = [
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
    const res2 = setFieldValue('age', 32)(res1);

    expect(res1).toEqual([
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

    expect(res2).toEqual([{
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
