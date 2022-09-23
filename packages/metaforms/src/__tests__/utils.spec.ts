import { isRequired } from '../validate/validateForm';
import { requiredRule } from '..';

describe('utils', () => {
  describe('isRequired', () => {
    it('should return correct value', () => {
      expect(isRequired([])).toEqual(false);
      expect(isRequired([requiredRule('is required')])).toEqual(true);
      expect(isRequired([{ message: 'x', type: 'mustmatch' as const, value: '' }])).toEqual(false);
    });
  });
});
