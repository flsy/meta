import { mustbeequalRule } from '../rules';
import { validateField } from '../validateForm';
import {getThreeStateSwitch} from '../../helpers';

describe('mustbeequal', () => {
  const validation = [mustbeequalRule('You need to agree to the terms and conditions', true)];

  it('should return an error if the value is not equal to the specified value', () => {
    const errorMessage = validateField(getThreeStateSwitch({ name: 'a', validation }), { a: false });

    expect(errorMessage).toEqual('You need to agree to the terms and conditions');
  });

  it('should not return an error if the value is equal to the specified value', () => {
    const errorMessage = validateField(getThreeStateSwitch({ name: 'a', validation }), { a: true });

    expect(errorMessage).toEqual(undefined);
  });

  it('should work for number types', () => {
    expect(validateField(getThreeStateSwitch({ name: 'a', validation: [mustbeequalRule('no', true)] }), { a: 5 })).toEqual('no');
    expect(validateField(getThreeStateSwitch({ name: 'a', validation: [mustbeequalRule('no', 6)] }), { a: 5 })).toEqual('no');
    expect(validateField(getThreeStateSwitch({ name: 'a', validation: [mustbeequalRule('no', 5)] }), { a: 5 })).toEqual(undefined);
  });
});
