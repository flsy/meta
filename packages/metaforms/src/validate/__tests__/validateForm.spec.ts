import {validateForm} from '../validateForm';
import {getCheckboxMeta, getObjectMeta, getSubmitMeta, getTextMeta} from '../../helpers';
import {requiredRule} from '../rules';

describe('validateForm', () => {

  it('should validate empty fields', () => {
    expect(validateForm([], { random: 'X' })).toEqual({});
  });


  it('should validate simple Text fields', () => {
    const fields = [
      getTextMeta({ name: 'a', validation: [requiredRule('a is required')] }),
      getTextMeta({ name: 'b', validation: [requiredRule('b is required')] }),
      getTextMeta({ name: 'c', validation: [requiredRule('c is required')] }),
    ];
    expect(validateForm(fields, { b: 'B' })).toEqual({ a: 'a is required', c: 'c is required'});
  });

  it('should validate array Text fields', () => {
    const fields = [
      getTextMeta({name: 'a', validation: [requiredRule('a is required')], array: true}),
      getTextMeta({name: 'b', validation: [requiredRule('b is required')], array: true}),
      getTextMeta({name: 'c', validation: [requiredRule('c is required')], array: true}),
    ];
    expect(validateForm(fields, { b: [], c: [undefined, null, 'C3', null] })).toEqual({ a: ['a is required'], b: ['b is required'], c: ['c is required', 'c is required', undefined, 'c is required']});
  });

  describe('object field', () => {
    const fields = [
      getObjectMeta({ name: 'a', validation: [requiredRule('a is required')], fields: [
        getTextMeta({ name: 'a1', validation: [requiredRule('a1 is required')] }),
        getTextMeta({ name: 'a2', validation: [requiredRule('a2 is required')] })
      ]}),
    ];

    it('should validate object field and set error on main field when contains error', () => {
      expect(validateForm(fields, {})).toEqual({ a: 'a is required' });
    });

    it('should validate object field and set error on children fields', () => {
      expect(validateForm(fields, { a: { a1: 'a value' }})).toEqual({ a: { a2: 'a2 is required'} });
    });

    it('should validate nested checkbox', () => {
      const fields =  [getObjectMeta({
        name: 'search',
        label: 'Search',
        validation: [
          requiredRule('Object field is required'),
        ],
        fields: [
          getTextMeta({
            name: 'term',
            label: 'Search term'
          }),
          getCheckboxMeta({
            name: 'valid',
            label: 'Valid'
          })
        ]
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Login',
      })
      ];
      expect(validateForm(fields)).toEqual({ search: 'Object field is required' });
      expect(validateForm(fields, { search: { valid: false } })).toEqual({ search: 'Object field is required' });
      expect(validateForm(fields, { search: { term: 'test' } })).toEqual({ search: {} });
      expect(validateForm(fields, { search: { valid: true } })).toEqual({ search: {} });
    });

    it('should validate Object field which is array as well', () => {
      const fields = [
        getObjectMeta({ name: 'names', validation: [requiredRule('names are required')], fields: [
          getTextMeta({ name: 'first', validation: [requiredRule('first name is required')] }),
          getTextMeta({ name: 'last', validation: [requiredRule('last name is required')] })
        ], array: true }),
      ];
      expect(validateForm(fields, { names: [undefined, { first: 'sem tu', last: 'sem tu' }, { last: 'sem tu' }, null]})).toEqual({
        names: [
          { first: 'first name is required', last: 'last name is required' },
          {},
          { first: 'first name is required'},
          { first: 'first name is required', last: 'last name is required' }
        ]
      });
      expect(validateForm(fields, { names: [{ first: 'sem tu', last: 'sem tu' }, { first: 'sem tu', last: 'sem tu' }]})).toEqual({
        names: [{}, {}]
      });
    });
  });
});