 import { filterColumnPaths, unsetAllSortFormValues, toMetaFilters } from '../utils';
import {Columns, IMetaFiltersArgs, MetaField} from '@falsy/metacore';
 import {
  getDateRangeFilter,
  getTextFilter,
  getTernaryFilter,
  columnBuilder,
   setValueText,
  setValueTernary, setValueDateRange
} from "metahelpers";
 import {pipe} from "fputils";

const customerIdFilterForm: MetaField[] = [
  {
    name: "customer.id.filters",
    type: 'text',
    value: 'CUST_ID',
  },
  {
    name: 'customer.id.type',
    type: 'hidden',
    value: 'string'
  },
  {
    name: "actions",
    type: "buttonGroup",
    items: [
        {
          name: 'reset',
          type: 'reset',
          label: 'Reset',
        },
        {
          name: 'submit',
          type: 'submit',
          label: 'Filtrovat',
        }
     ]
  },
];

 const customerIdFilterFormWithOptions: MetaField[] = [
   {
     name: "customer.id.filters",
     type: 'text',
     value: 'customr #2',
   },
   {
     name: 'customer.id.options',
     type: 'select',
     options: [{ value: 'EQ', label: 'Přesná shoda'}, { value: 'LIKE', label: 'Fulltext'}],
     value: 'EQ'
   },
   {
     name: 'customer.id.type',
     type: 'hidden',
     value: 'string'
   },
   {
     name: "actions",
     type: "buttonGroup",
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
       }
     ]
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
        filterForm: getTextFilter(['name'], {
          value: 'hey',
          label: 'Name',
        }),
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
      filterForm: customerIdFilterFormWithOptions,
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
        name: 'isDeleted.filters',
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

const col2toMetafilterOutput: IMetaFiltersArgs = {
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
        filters: [
          { operator: 'EQ', value: 'customr #2' }
        ]
      }
    },
  },
};

describe('Metatable utils', () => {
  describe('all form types', () => {
    describe('string filters', () => {
      it('return undefined when value is not set', async () => {
        expect(toMetaFilters(columnBuilder().addStringColumn('longText',{
          label: 'Dlouhý text',
          filterForm: getTextFilter(['longText'], { label: 'Dlouhý text', withOptions: true, defaultOption: 'EQ' }),
        }).columns).filters).toEqual({})
      });

      it('return right value when set', async () => {
        expect(toMetaFilters(columnBuilder().addStringColumn('longText',{
          label: 'Dlouhý text',
          filterForm: pipe(getTextFilter(['longText'], { label: 'Dlouhý text', withOptions: true }), setValueText('ok', 'LIKE'))
        }).columns).filters)
        .toEqual({
          longText: {
            type: "string",
            filters: [{ value: "ok", operator: "LIKE" }]
          }
        })
      })
    })

    describe('boolean filters', () => {
      it('return undefined when value is not set', async () => {
        expect(toMetaFilters(columnBuilder().addBooleanColumn('isPublished', {
          label: 'Is published',
          filterForm: getTernaryFilter(['isPublished'], { label: 'Is published' }),
        }).columns).filters).toEqual({})
      });
      it('return right values when set', async () => {
        expect(toMetaFilters(columnBuilder().addBooleanColumn('isPublished', {
          label: 'Is published',
          filterForm: pipe(getTernaryFilter(['isPublished'], { label: 'Is published' }), setValueTernary(false))
        }).columns).filters).toEqual({
          isPublished: {
            type: 'boolean',
            value: false
          }
        })
      });
    });

    describe('number filters', () => {
      it('return undefined when value is not set', async () => {
        expect(toMetaFilters(columnBuilder().addNumberColumn('createdAtFormatted', {
          label: 'Čas vytvoření',
          filterForm: getDateRangeFilter(['createdAtFormatted'], { label: 'Čas vytvoření' }),
        }).columns).filters).toEqual({})
      });

      it('return right values when set', async () => {
        expect(toMetaFilters(columnBuilder().addNumberColumn('createdAtFormatted', {
          label: 'Čas vytvoření',
          filterForm: pipe(getDateRangeFilter(['createdAtFormatted'], { label: 'Čas vytvoření' }), setValueDateRange([5, 8]))
        }).columns).filters).toEqual({
          createdAtFormatted: {
            type: "number",
            filters: [
              { operator: "GT", value: 5 },
              { operator: "LT", value: 8 }
            ],
          }
        })
      });
    });
  });

  it('transform to meta filters', async () => {
    expect(toMetaFilters(mockedColumns2)).toMatchObject(col2toMetafilterOutput);
    expect(toMetaFilters(
      {
        name: {
          type: 'string',
          label: 'Jmeno',
          filterForm: getTextFilter(['name'], { withOptions: true, label: 'Label' }),
          sortForm: [
            {
              name: 'longText',
              type: 'sort',
            },
          ],
        },
      }
    )).toMatchObject({});
    const filterForm = getTextFilter(['name'], { withOptions: true, label: 'Label' }).map(field => {
      if (field.type === 'text') {
        return {...field, value: 'hodnota' }
      }
      if (field.type === 'select') {
        return {...field, value: 'LIKE' }
      }
      return field
    });

    expect(toMetaFilters(
        {
          name: {
            type: 'text',
            label: 'Jmeno',
            filterForm,
            sortForm: [
              {
                name: 'longText',
                type: 'sort',
              },
            ],
          },
        }
    )).toMatchObject({
      sort: {},
      filters: {
        name: {
          type: 'string',
          filters: [{ value: 'hodnota', operator: 'LIKE'}]
        }
      }
    });
  });

  it('transform to metafilters with dateRange', () => {
    const columns: Columns<string> = {
      timestamp: {
        type: 'timestamp',
        label: 'Čas události',
        sortForm: [
          {
            name: 'timestamp',
            type: 'sort',
          },
        ],
        filterForm: getDateRangeFilter(['timestamp'], { label: 'Čas události', withTimePicker: true }).map(field => {
          if (field.type ==='dateRangeCalendar') {
            return  {...field, value: [8, 5]}
          }

          return field
        }),
      },
    }

    expect(toMetaFilters(columns)).toEqual({
     filters: {
        timestamp: {
          filters: [
            {
              operator: "GT",
              value: 5
            },
            {
              operator: "LT",
              value: 8
            }
          ],
          type: "number"
        }
      },
      sort: {}
    });
  })

  it('gets string filter without value, label and submit', () => {
    expect(getTextFilter(['a', 'b'])).toEqual([
      {
        "name": "a.b.filters",
        "type": "text"
      },
      {
        "name": "a.b.type",
        "type": "hidden",
        "value": "string"
      },
      {
        "name": "actions",
        "type": "buttonGroup",
        "items": [
          {
            "label": "Reset",
            "name": "reset",
            "size": "small",
            "type": "reset"
          },
          {
            "label": "Filtrovat",
            "name": "submit",
            "primary": true,
            "size": "small",
            "type": "submit"
          }
        ],
      }
    ])
  })

  it('gets string filter', async () => {
    expect(getTextFilter(['customer', 'id'], {
      value: 'CUST_ID',
      label: 'Customer id'}
    )).toMatchObject(customerIdFilterForm);
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
      filterForm: getTextFilter(['customer', 'id'], { withOptions: true, value: 'customr #2', defaultOption: 'EQ' })
    });

    expect(result2.isDeleted).toEqual({
      filterForm: [
        {
          name: "isDeleted.type",
          type: "hidden",
          value: "boolean"
        },
        {
          "name": "isDeleted.filters",
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
            label: 'Name',
            name: "name.filters",
            type: "text",
            value: "hey"
          },
          {
            name: "name.type",
            type: "hidden",
            value: "string"
          },
          {
            name: "actions",
            type: "buttonGroup",
            items: [
              {
                label: "Reset",
                name: "reset",
                size: "small",
                type: "reset",
              },
              {
                label: "Filtrovat",
                name: "submit",
                size: "small",
                primary: true,
                type: "submit"
              }
            ],
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
