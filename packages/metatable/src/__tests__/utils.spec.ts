import { filterColumnPaths, getStringFilter, toMetaFilters } from '../utils';

const customerIdFilterForm = {
  customer: {
    type: 'group',
    fields: {
      id: {
        type: 'group',
        fields: {
          type: {
            type: 'hidden',
            value: 'string',
          },
          filters: {
            type: 'string-filter',
            value: [{ operator: 'EQ', value: "CUST_ID" }]
          },
          submit: {
            type: 'submit',
            label: 'submit',
          },
        }
      }
    }
  }
}

const columns = {
  id: {
    label: 'id',
    type: 'number',
    key: true,
    isOmitted: true,
    sortForm: {
      id: {
        type: 'sort',
        value: 'ASC',
      },
    },
  },
  name: {
    label: 'name',
    type: 'string',
    key: false,
  },
  customer: {
    id: {
      label: 'customer id',
      type: 'string',
      key: false,
      filterForm: customerIdFilterForm,
      sortForm: {
        name: {
          type: 'sort',
        },
      },
    },
  },
  isDeleted: {
    label: 'is deleted',
    type: 'boolean',
    key: false,
    isOmitted: true,
    filterForm: {
      isDeleted: {
        type: 'group',
        fields: {
          type: {
            type: 'hidden',
            value: 'boolean',
          },
          value: {
            type: 'checkbox',
            value: false,
          },
          submit: {
            type: 'submit',
            label: 'submit',
          },
        }
      },
    },
  },
};

const output = {
  sort: {
    id: 'ASC',
    name: undefined,
  },
  filters: {
    isDeleted: { type: 'boolean', value: false },
    customer: {
      id: {
        type: 'string',
        filters: [{ operator: "EQ", value: 'CUST_ID' }],
      },
    },
  },
};

describe('Metatable utils', () => {
  it('transform to meta filters', async () => {
    expect(toMetaFilters(columns)).toMatchObject(output);
  });
  it('gets string filter', async () => {
    expect(getStringFilter(['customer', 'id'], [{ operator: "EQ", value: 'CUST_ID' }])).toMatchObject(customerIdFilterForm);
  });
  it('filters column path', async () => {
    const displayedColumnPaths = filterColumnPaths((column) => !column?.isOmitted)(columns);
    expect(displayedColumnPaths).toMatchObject([['name'], ['customer', 'id']]);
  });
});
