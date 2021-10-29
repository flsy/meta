 import { filterColumnPaths, getStringFilter, unsetAllSortFormValues, toMetaFilters } from '../utils';
import { Columns, MetaField } from '@falsy/metacore';

const customerIdFilterForm: MetaField[] = [
  {
    name: 'customer.id.type',
    type: 'hidden',
    value: 'string'
  },
  {
    name: "customer.id.filters",
    type: 'text',
    value: [{ operator: 'EQ', value: 'CUST_ID' }],
  },
  {
    name: 'submit',
    type: 'submit',
    label: 'submit',
  },
];

const mockedColumns1: Columns<'number' | 'timestamp' | 'string' | 'boolean'> = {
  id: {
    type: 'number',
    label: 'Id',
    key: true,
    sortForm: [{
        name: 'id',
        type: 'sort',
      },
    ],
  },
  createdAtFormatted: {
    type: 'timestamp',
    label: 'CreatedAt',
    sortForm: [
      {
        name: 'createdAt',
        type: 'sort',
      },
    ]
  },
  createdBy: {
    name: {
      type: 'string',
      label: 'CreatedBy',
      sortForm: [{
        name: "createdBy.name",
        type: 'sort',
        value: 'ASC',
      }],
      filterForm: getStringFilter(['name'], [{ value: 'hey', operator: 'EQ' }]),
    },
  },
  attachments: {
    content: {
      type: 'string',
      label: 'Attachment content',
    },
    description: {
      type: 'string',
      label: 'Attachment description',
    },
  },
  isPublished: {
    type: 'boolean',
    label: 'Is published',
  },
  content: {
    type: 'string',
    label: 'Content',
    sortForm: [{
      name: 'content',
      type: 'sort',
      value: 'ASC',
    }],
    filterForm: [{
        name: 'content',
        label: 'Kontent',
        type: 'text',
        value: null,
        placeholder: 'Obsah',
        errorMessage: null,
      },
      {
        name: 'submit',
        type: 'submit',
        label: 'Uložit',
      },
    ],
  },
};
const mockedColumns2: Columns<'number' | 'string' | 'boolean'> = {
  id: {
    label: 'id',
    type: 'number',
    key: true,
    isOmitted: true,
    sortForm: [{
        name: 'id',
        type: 'sort',
        value: 'ASC',
      },
    ],
  },
  name: {
    label: 'name',
    type: 'string',
    key: false,
    sortForm: [{
        name: 'id',
        type: 'sort',
        value: 'ASC',
      },
    ],
  },
  customer: {
    id: {
      label: 'customer id',
      type: 'string',
      key: false,
      filterForm: customerIdFilterForm,
      sortForm: [{
          name: 'name',
          type: 'sort',
        },
      ],
    },
  },
  isDeleted: {
    label: 'is deleted',
    type: 'boolean',
    key: false,
    isOmitted: true,
    filterForm: [
      {
        name: 'isDeleted.type',
        type: 'hidden',
        value: 'boolean',
      },
      {
        name: 'isDeleted.value',
        type: 'checkbox',
        value: false,
      },
      {
        name: 'submit',
        type: 'submit',
        label: 'submit',
      }
    ]
  },
};

const col2toMetafilterOutput = {
  sort: {
    id: 'ASC',
  },
  filters: {
    isDeleted: {
      type: 'boolean',
      value: false
    },
    customer: {
      id: {
        type: 'string',
        filters: [{ operator: 'EQ', value: 'CUST_ID' }],
      },
    },
  },
};

describe('Metatable utils', () => {
  it('transform to meta filters', async () => {
    expect(toMetaFilters(mockedColumns2)).toMatchObject(col2toMetafilterOutput);
  });
  it('gets string filter', async () => {
    expect(getStringFilter(['customer', 'id'], [{ operator: 'EQ', value: 'CUST_ID' }])).toMatchObject(customerIdFilterForm);
  });
  it('filters column path', async () => {
    const displayedColumnPaths = filterColumnPaths((column) => !column?.isOmitted)(mockedColumns2);
    expect(displayedColumnPaths).toEqual([['name'], ['customer', 'id']]);
  });
  it('unsetAllSortFormValues simple columns', async () => {
    const result2 = unsetAllSortFormValues(mockedColumns2);

    expect(result2.id).toEqual({
      isOmitted: true,
      key: true,
      label: 'id',
      sortForm: [
        {
          name: 'id',
          type: 'sort',
          value: undefined,
        },
      ],
      type: 'number',
    });

    expect(result2.name).toEqual({
      key: false,
      label: 'name',
      sortForm: [
        {
          name: 'id',
          type: 'sort',
          value: undefined,
        },
      ],
      type: 'string',
    });

    expect(result2.customer['id']).toEqual({
      key: false,
      label: 'customer id',
      sortForm: [
        {
          name: 'name',
          type: 'sort',
          value: undefined,
        },
      ],
      type: 'string',
      filterForm: [
        {
          name: "customer.id.type",
          type: "hidden",
          value: "string"
        },
        {
          name: "customer.id.filters",
          type: "text",
          value: [
            {
              operator: "EQ",
              value: "CUST_ID"
            }
          ]
        },
        {
          label: "submit",
          name: "submit",
          type: "submit"
        }
      ],
    });

    expect(result2.isDeleted).toEqual({
      filterForm: [
        {
          name: "isDeleted.type",
          type: "hidden",
          value: "boolean"
        },
        {
          name: "isDeleted.value",
          type: "checkbox",
          value: false
        },
        {
          label: "submit",
          name: "submit",
          type: "submit"
        }
      ],
      isOmitted: true,
      key: false,
      label: 'is deleted',
      type: 'boolean',
    });
  });
  it('unsetAllSortFormValues nested columns', async () => {
    const result2 = unsetAllSortFormValues(mockedColumns1);

    expect(result2.id).toEqual({
      key: true,
      label: 'Id',
      sortForm: [
        {
          name: 'id',
          type: 'sort',
          value: undefined,
        },
      ],
      type: 'number',
    });

    expect(result2.createdBy).toEqual({
      name: {
        filterForm: [
          {
            name: "name.type",
            type: "hidden",
            value: "string"
          },
          {
            name: "name.filters",
            type: "text",
            value: [
              {
                operator: "EQ",
                value: "hey"
              }
            ]
          },
          {
            label: "submit",
            name: "submit",
            type: "submit"
          }
        ],
        label: 'CreatedBy',
        sortForm: [{
            name: 'createdBy.name',
            type: 'sort',
            value: undefined,
          },
        ],
        type: 'string',
      },
    });
  });
});
