import { getFormData } from '../utils';
import { Form, GroupField, NumberField, SubmitField, TextField } from '../interfaces';

describe('getFormData', () => {
  it('returns form data', () => {
    type MyForm = Form<{ name: TextField; detailed: GroupField<{ age: NumberField; emptyGroup: GroupField<{}> }>; submit: SubmitField }>;

    const form1: MyForm = {
      name: {
        type: 'text',
        value: 'default value',
      },
      detailed: {
        type: 'group',
        fields: {
          age: {
            type: 'number',
            value: 18,
          },
          emptyGroup: {
            type: 'group',
            fields: {
              d: {
                type: 'text',
              },
            },
          },
        },
      },
      submit: {
        type: 'submit',
      },
    };

    const data = getFormData(form1);
    expect(data).toEqual({
      name: 'default value',
      detailed: {
        age: 18,
      },
    });
  });

  it('returns form data from custom fields', () => {
    interface NumberValuesField {
      type: 'numberValues';
      value: number[];
    }

    type MyForm = Form<{ myCustom: NumberValuesField; myGroup: GroupField<{ myCustomNested: NumberValuesField; inGroup: TextField }>; submit: SubmitField }>;

    const form1: MyForm = {
      myCustom: {
        type: 'numberValues',
        value: [1, 8],
      },
      myGroup: {
        type: 'group',
        fields: {
          myCustomNested: {
            type: 'numberValues',
            value: [10],
          },
          inGroup: {
            type: 'text',
            value: 'group value',
          },
        },
      },
      submit: {
        type: 'submit',
      },
    };

    expect(getFormData(form1)).toEqual({
      myCustom: [1, 8],
      myGroup: {
        inGroup: 'group value',
        myCustomNested: [10],
      },
    });
  });
});
