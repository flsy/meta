import { getTextFilter } from '../filters';

describe('filters', () => {
  describe('getTextFilter', () => {
    it('gets string filter without value, label and submit', () => {
      expect(getTextFilter(['a', 'b'])).toEqual([
        {
          name: 'a.b.filters',
          type: 'text',
        },
        {
          name: 'a.b.type',
          type: 'hidden',
          value: 'string',
        },
        {
          name: 'actions',
          type: 'buttonGroup',
          items: [
            {
              name: 'reset',
              type: 'reset',
              size: 'small',
              label: 'Reset',
            },
            {
              name: 'submit',
              type: 'submit',
              size: 'small',
              primary: true,
              label: 'Filtrovat',
            },
          ],
        },
      ]);
    });

    it('gets string filter', async () => {
      expect(
        getTextFilter(['customer', 'id'], {
          value: 'CUST_ID',
          label: 'Customer id',
        }),
      ).toEqual([
        {
          name: 'customer.id.filters',
          label: 'Customer id',
          type: 'text',
          value: 'CUST_ID',
        },
        {
          name: 'customer.id.type',
          type: 'hidden',
          value: 'string',
        },
        {
          name: 'actions',
          type: 'buttonGroup',
          items: [
            {
              name: 'reset',
              type: 'reset',
              size: 'small',
              label: 'Reset',
            },
            {
              name: 'submit',
              type: 'submit',
              size: 'small',
              primary: true,
              label: 'Filtrovat',
            },
          ],
        },
      ]);
    });

    it('gets string filter with select options', async () => {
      expect(
          getTextFilter(['customer', 'id'], {
            value: 'CUST_ID',
            label: 'Customer id',
            withOptions: true
          }),
      ).toEqual([
        {
          name: 'customer.id.filters',
          label: 'Customer id',
          type: 'text',
          value: 'CUST_ID',
        },
        {
          name: 'customer.id.options',
          type: 'select',
          options: [
              { value: 'EQ', label: 'Přesná shoda' },
              { value: 'LIKE', label: 'Fulltext' }]
        },
        {
          name: 'customer.id.type',
          type: 'hidden',
          value: 'string',
        },
        {
          name: 'actions',
          type: 'buttonGroup',
          items: [
            {
              name: 'reset',
              type: 'reset',
              size: 'small',
              label: 'Reset',
            },
            {
              name: 'submit',
              type: 'submit',
              size: 'small',
              primary: true,
              label: 'Filtrovat',
            },
          ],
        },
      ]);
    });
  });
});
