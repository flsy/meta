import { inListRule } from '../rules';
import { validateField } from '../validateForm';
import {getTextMeta} from '../../helpers';

describe('inlist', () => {
  const validation = [inListRule('Title was not a valid choice', ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Rev', 'Prof', 'Other'])];

  it('should return an error if the user selects an invalid option', () => {
    const errorMessage = validateField(getTextMeta({ name: 'title', validation }), { title: 'Sir' });

    expect(errorMessage).toEqual('Title was not a valid choice');
  });

  it('should not return an error if the user selects something in the list of options', () => {
    const errorMessage = validateField(getTextMeta({ name: 'title', validation }), { title: 'Mr' });

    expect(errorMessage).toEqual(undefined);
  });
});
