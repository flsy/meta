import { Validation } from '@falsy/metacore';
import { maxRule, minRule } from '../rules';
import { validateField } from '../validateForm';
import {getNumberMeta} from '../../helpers';

describe('min', () => {
  const validation: Validation[] = [minRule('min value is 10', 10)];

  it('should return an error if value is lower than 10', () => {
    const errorMessage = validateField(getNumberMeta({ name: 'count', validation }), { count: 9 });

    expect(errorMessage).toEqual('min value is 10');
  });

  it('should return an error if value is  not a number', () => {
    const errorMessage = validateField(getNumberMeta({ name: 'count', validation }), { count: '3' });

    expect(errorMessage).toEqual('min value is 10');
  });

  it('should return undefined if value is  not a number', () => {
    const errorMessage = validateField(getNumberMeta({ name: 'a', validation }), { a: 'Hello world' });

    expect(errorMessage).toEqual(undefined);
  });

  it('should return undefined if value is greater than 10', () => {
    const errorMessage = validateField(getNumberMeta({ name: 'count', validation }), { count: 11 });

    expect(errorMessage).toEqual(undefined);
  });
});

describe('max', () => {
  const validation: Validation[] = [maxRule('max value is 10', 10)];

  it('should return an error if value is greater than 10', () => {
    const errorMessage = validateField(getNumberMeta({ name: 'a', validation }), { a: 11 });

    expect(errorMessage).toEqual('max value is 10');
  });

  it('should parse string if possible and return and return error when value greater than 10', () => {
    const errorMessage = validateField(getNumberMeta({ name: 'a', validation }), { a: '11'});

    expect(errorMessage).toEqual('max value is 10');
  });

  it('should return undefined if value is  not a number', () => {
    const errorMessage = validateField(getNumberMeta({ name: 'a', validation }), { a: 'Hello world' });

    expect(errorMessage).toEqual(undefined);
  });
});
