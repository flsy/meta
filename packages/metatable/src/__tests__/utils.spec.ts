import { filterColumnPaths, getStringFilter, unsetAllSortFormValues, toMetaFilters, getFilterFormValue } from '../utils';

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
            type: 'text',
            value: [{ operator: 'EQ', value: 'CUST_ID' }],
          },
          submit: {
            type: 'submit',
            label: 'submit',
          },
        },
      },
    },
  },
};
const mockedColumns1 = {
  id: {
    type: 'number',
    label: 'Id',
    key: true,
    sortForm: {
      id: {
        type: 'sort',
      },
    },
  },
  createdAtFormatted: {
    type: 'timestamp',
    label: 'CreatedAt',
    sortForm: {
      createdAt: {
        type: 'sort',
      },
    },
  },
  createdBy: {
    name: {
      type: 'string',
      label: 'CreatedBy',
      sortForm: {
        createdBy: {
          type: 'group',
          fields: {
            name: {
              type: 'sort',
              value: 'ASC',
            },
          },
        },
      },
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
    sortForm: {
      content: {
        type: 'sort',
        value: 'ASC',
      },
    },
    filterForm: {
      content: {
        label: 'Kontent',
        type: 'text',
        value: null,
        placeholder: 'Obsah',
        errorMessage: null,
      },
      submit: {
        type: 'submit',
        label: 'Uložit',
      },
    },
  },
};
const mockedColumns2 = {
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
    sortForm: {
      id: {
        type: 'sort',
        value: 'ASC',
      },
    },
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
        },
      },
    },
  },
};

const col2toMetafilterOutput = {
  sort: {
    id: 'ASC',
    name: undefined,
  },
  filters: {
    isDeleted: { type: 'boolean', value: false },
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
      sortForm: {
        id: {
          type: 'sort',
          value: undefined,
        },
      },
      type: 'number',
    });

    expect(result2.name).toEqual({
      key: false,
      label: 'name',
      sortForm: {
        id: {
          type: 'sort',
          value: undefined,
        },
      },
      type: 'string',
    });

    expect(result2.customer.id).toEqual({
      key: false,
      label: 'customer id',
      sortForm: {
        name: {
          type: 'sort',
          value: undefined,
        },
      },
      type: 'string',
      filterForm: {
        customer: {
          fields: {
            id: {
              fields: {
                filters: {
                  type: 'text',
                  value: [
                    {
                      operator: 'EQ',
                      value: 'CUST_ID',
                    },
                  ],
                },
                submit: {
                  label: 'submit',
                  type: 'submit',
                },
                type: {
                  type: 'hidden',
                  value: 'string',
                },
              },
              type: 'group',
            },
          },
          type: 'group',
        },
      },
    });

    expect(result2.isDeleted).toEqual({
      filterForm: {
        isDeleted: {
          fields: {
            submit: {
              label: 'submit',
              type: 'submit',
            },
            type: {
              type: 'hidden',
              value: 'boolean',
            },
            value: {
              type: 'checkbox',
              value: false,
            },
          },
          type: 'group',
        },
      },
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
      sortForm: {
        id: {
          type: 'sort',
          value: undefined,
        },
      },
      type: 'number',
    });

    expect(result2.createdBy).toEqual({
      name: {
        filterForm: {
          name: {
            fields: {
              filters: {
                type: 'text',
                value: [
                  {
                    operator: 'EQ',
                    value: 'hey',
                  },
                ],
              },
              submit: {
                label: 'submit',
                type: 'submit',
              },
              type: {
                type: 'hidden',
                value: 'string',
              },
            },
            type: 'group',
          },
        },
        label: 'CreatedBy',
        sortForm: {
          createdBy: {
            type: 'group',
            fields: {
              name: {
                type: 'sort',
                value: undefined,
              },
            },
          },
        },
        type: 'string',
      },
    });
  });
  describe('getFilterFormValue', () => {
    it('gets filter form value', async () => {
      const value = getFilterFormValue(mockedColumns1.createdBy.name.filterForm);
      expect(value).toEqual([{ operator: 'EQ', value: 'hey' }]);
    });
    it('gets nested filter form value', async () => {
      const value = getFilterFormValue(getStringFilter(['user', 'info', 'username'], [{ value: 'joe', operator: 'LIKE' }]));
      expect(value).toEqual([{ operator: 'LIKE', value: 'joe' }]);
    });
    it('gets filter form value if filter form is undefined', async () => {
      const value = getFilterFormValue(undefined);
      expect(value).toEqual(undefined);
    });
    it('gets filter form value if value is undefined', async () => {
      const value = getFilterFormValue(getStringFilter(['name'], undefined));
      expect(value).toEqual(undefined);
    });
  });
});
