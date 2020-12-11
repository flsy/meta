import {
  filterColumnPaths,
  getSortFormPath,
  getStringFilter,
  setSortFormValue,
  toMetaFilters,
} from '../utils';

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
        value: 'ASC',
      },
    },
  },
  createdBy: {
    name: {
      type: 'string',
      label: 'CreatedBy',
      sortForm: {
        name: {
          type: 'sort',
        },
      },
      filterForm: {
        name: {
          label: 'Name',
          type: 'text',
          value: null,
          placeholder: 'name placeholder',
          errorMessage: null,
        },
        submit: {
          type: 'submit',
          label: 'Uložit',
        },
      },
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
        }
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
        filters: [{ operator: "EQ", value: 'CUST_ID' }],
      },
    },
  },
};

describe('Metatable utils', () => {
  it('transform to meta filters', async () => {
    expect(toMetaFilters(mockedColumns2)).toMatchObject(col2toMetafilterOutput);
  });
  it('gets string filter', async () => {
    expect(getStringFilter(['customer', 'id'], [{ operator: "EQ", value: 'CUST_ID' }])).toMatchObject(customerIdFilterForm);
  });
  it('filters column path', async () => {
    const displayedColumnPaths = filterColumnPaths((column) => !column?.isOmitted)(mockedColumns2);
    expect(displayedColumnPaths).toEqual([['name'], ['customer', 'id']]);
  });
  it('gets sort form path', async () => {
    const displayedColumnPaths = getSortFormPath({
      customer: {
        type: 'group',
        fields: {
          login: {
            type: 'group',
            fields: {
              id: {
                type: 'sort',
              }
            }
          }
        }
      },
      },
     );
    expect(displayedColumnPaths).toEqual(['customer', 'fields', 'login', 'fields', 'id']);
  });
  it('sets sort form value', async () => {
    const result2 = setSortFormValue(['id'], 'DESC', mockedColumns2);
    expect(result2.name).toEqual({
      key: false,
      label: "name",
      sortForm: {
        id: {
          type: "sort"
        }
      },
      type: "string"
    })

    expect(result2.customer.id).toEqual(
      {
        key: false,
        label: "customer id",
        sortForm: {
          name: {
            type: "sort",
            value: undefined,
          }
        },
        type: "string",
        filterForm: {
          customer: {
            fields: {
              id: {
                fields: {
                  filters: {
                    type: "string-filter",
                    value: [
                      {
                        "operator": "EQ",
                        "value": "CUST_ID"
                      }
                    ]
                  },
                  submit: {
                    label: "submit",
                    type: "submit"
                  },
                  type: {
                    type: "hidden",
                    value: "string"
                  }
                },
                type: "group"
              }
            },
            type: "group"
          }
        },
      }
    )

    expect(result2.id).toEqual({
      isOmitted: true,
      key: true,
      label: "id",
      sortForm: {
        id: {
          type: "sort",
          value: "DESC"
        }
      },
      type: "number"
    })

    expect(result2.isDeleted).toEqual(
      {
        filterForm: {
          isDeleted: {
            fields: {
              submit: {
                label: "submit",
                type: "submit"
              },
              type: {
                type: "hidden",
                value: "boolean"
              },
              value: {
                type: "checkbox",
                value: false
              }
            },
            type: "group"
          }
        },
        isOmitted: true,
        key: false,
        label: "is deleted",
        type: "boolean"
      }
    )

    const result3 = setSortFormValue(['createdAtFormatted'], 'DESC', mockedColumns1);
    expect(result3.id.sortForm).toEqual({ id: { value: undefined, type: 'sort' }})
    expect(result3.createdAtFormatted.sortForm).toEqual({ createdAt:{ value: 'DESC', type: 'sort' }})
    expect(result3.content.sortForm).toEqual({ content: { value: undefined, type: 'sort' }})
    expect(result3.isPublished).toEqual({ label: "Is published", type: 'boolean' })
  });
});
