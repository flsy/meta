import { getValues } from '../utils';

describe('getValues', () => {
  it('returns form data', () => {
    const form1 = [
      {
        type: 'text',
        name: 'name',
        value: 'default value',
      },
      {
        type: 'number',
        name: 'detailed.age',
        value: 18,
      },
      {
        type: 'boolean',
        name: 'detailed.agree',
        value: false,
      },
      {
        type: 'submit',
        name: 'submit',
      },
    ];

    const data = getValues(form1);
    expect(data).toMatchObject({
      name: 'default value',
      detailed: {
        agree: false,
        age: 18,
      },
    });
  });
});
