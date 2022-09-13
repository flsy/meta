import { getErrorMessages, hasError, maxlength, pattern, required, validateForm } from '..'
import {MetaField} from "@falsy/metacore";

const fields: MetaField[] = [
  {
    type: 'text',
    name: 'name',
    validation: [required('fill name')],
  },
  {
    type: 'number',
    name: 'age',
    validation: [required('fill age'), maxlength('max 3 digits', 3)],
  },
  {
    type: 'dateRange',
    name: 'dob',
    validation: [required('fill DOB'), pattern('wrong date format', '^[0-9]+$')],
  },
];

describe('fields behaviour', () => {
  it('returns errors when fields are empty', () => {
    const result = validateForm(fields);

    expect(hasError(result)).toEqual(true);

    expect(getErrorMessages(result)).toEqual({
      name: 'fill name',
      age: 'fill age',
      dob: 'fill DOB'
    });
  });

  // it('returns errors when fields filled with wrong values', () => {
  //   const filled = compose(setFieldValue('name', 'Joel'), setFieldValue('age', 'Joel'), setFieldValue('born', 'xxx'))(fields);
  //
  //   const result = validateForm(filled);
  //
  //   expect(hasError(result)).toEqual(true);
  //
  //   expect(result?.name?.errorMessage).toEqual(undefined);
  //   expect(result?.age?.errorMessage).toEqual('max 3 digits');
  //   expect(result?.born?.errorMessage).toEqual('wrong date format');
  // });
  //
  // it('returns no errors when fields are properly filled', () => {
  //   const filled = compose(setFieldValue('name', 'Joel'), setFieldValue('age', 50), setFieldValue('born', '20'))(fields);
  //
  //   const result = validateForm(filled);
  //
  //   expect(hasError(result)).toEqual(false);
  //
  //   expect(result?.name?.errorMessage).toEqual(undefined);
  //   expect(result?.age?.errorMessage).toEqual(undefined);
  //   expect(result?.born?.errorMessage).toEqual(undefined);
  //
  //   expect(getFormData(filled)).toEqual({ name: 'Joel', age: 50, born: '20' });
  // });
});
