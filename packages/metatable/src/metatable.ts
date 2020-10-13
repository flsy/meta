import { arg, inputObjectType, intArg, objectType, stringArg } from '@nexus/schema';
import { BooleanFilter, NumberFilter, StringFilter } from './types';
import { IColumnBody, IColumn } from './interfaces';
import { NexusObjectTypeDef } from '@nexus/schema/dist/definitions/objectType';
import { camelize, capitalize } from './tools';
import { Field } from 'metaforms';

export const getOperators = (column: IColumnBody): Array<string | null> => {
  switch (column.type) {
    case 'string':
      return ["EQ", "LIKE", null]
    case 'number':
      return ["EQ", "NE", "GT", "GE", "LT", "LE", null]
    default:
      return []
  }
}

const getFilterType = (column: IColumnBody) => {
  switch (column.type){
    case 'number':
      return NumberFilter;
    case 'string':
      return StringFilter
    case 'boolean':
      return BooleanFilter;
  }
}

const isColumnBody = (column: IColumnBody | IColumn): column is IColumnBody => !!column.type;


// const getSortObjectType = (name: string, columns: IColumn[]) => inputObjectType({
//   name,
//   definition: (t) => {
//     columns.forEach(column => {
//       if (isNestedColumn(column)) {
//         t.field(column.path, { type: getSortObjectType(`${name}${column.path}`, column.value) });
//       } else {
//         t.field(column.name, { type: Sort });
//       }
//     })
//   },
// });

const getNestedType = (name: string, column: IColumn) => inputObjectType({
    name: `${capitalize(name)}Filter`,
    definition(t) {
      Object.entries(column).forEach(([key, value]) => {
        if (isColumnBody(value)) {
          const type = getFilterType(value)
          if (type) {
            t.field(key, { type, nullable: true });
          }
        } else {
          t.field(key, { type: getNestedType(key, value), nullable: true });
        }
      })
    }
  })

const getFilterObjectType = (name: string, columns: IColumn) => inputObjectType({
    name,
    definition: (t) => {
      Object.entries(columns).forEach(([key, column]) => {
        if (isColumnBody(column)) {
          const type = getFilterType(column)
          if (type) {
            t.field(key, { type, nullable: true });
          }
        } else {
          t.field(key, { type: getNestedType(key, column), nullable: true });
        }
      });
    }
  })

const TextField = objectType({
  name: 'TextField',
  definition: (t) => {
    t.string('value', { nullable: true });
    t.string('type');
    t.string('label', { nullable: true });
    t.string('placeholder', { nullable: true });
    t.string('errorMessage', { nullable: true });
    // t.field('validation', { type: FormValidation, list: true, nullable: true });
  },
});

const BooleanField = objectType({
  name: 'BooleanField',
  definition: (t) => {
    t.boolean('value', { nullable: true });
    t.string('type');
    t.string('label', { nullable: true });
    t.string('placeholder', { nullable: true });
    t.string('errorMessage', { nullable: true });
    // t.field('validation', { type: FormValidation, list: true, nullable: true });
  },
});

const NumberField = objectType({
  name: 'NumberField',
  definition: (t) => {
    t.int('value', { nullable: true });
    t.string('type');
    t.string('label', { nullable: true });
    t.string('placeholder', { nullable: true });
    t.string('errorMessage', { nullable: true });
    // t.field('validation', { type: FormValidation, list: true, nullable: true });
  },
});

const filterForm = (name: string, filterForm: Field) => objectType({
  name: `${name}Form`,
  definition: (t) => {
    Object.entries(filterForm).forEach(([key, value]) => {
      switch (value && value.type) {
        case 'number': {
          t.field(key, { type: NumberField })
        }
        break;
        case 'boolean': {
          t.field(key, { type: BooleanField })
        }
        break;
        default: {
          t.field(key, { type: TextField })
        }
       }
    })
  }
});

const finalColumnDefinition = (name: string, column: IColumnBody) => objectType({
  name: name,
  definition: (t) => {
        t.string('type');
        t.string('label');
        t.boolean('key', { resolve: (body: IColumnBody) => body.key || false });
        if (column.filterForm) {
          t.field('filterForm', { type: filterForm(name, column.filterForm), nullable: true });
        }

    // t.boolean("isFiltered", { nullable: true }); // todo
    // t.field("sorted", { nullable: true, type: Sort }); // todo
    // t.string("sortOptions", { nullable: true, list: [false], resolve: (column: IColumn) => column.isSortable ? ['ASC', 'DESC', null]: [] });
    // t.string("filterOperators", { nullable: true, list: [false], resolve: (column) => column.isFilterable ? getOperators(column) : [] });
  }
});

const columnDefinition = (name: string, columns: IColumn) => {

  return objectType({
    name,
    definition: (t) => {
      Object.entries(columns).forEach(([key, column]) => {
        if (isColumnBody(column)) {
          t.field(key, { type: finalColumnDefinition(camelize([key, name]), column), resolve: () => column });
        } else {
          t.field(key, { type: columnDefinition(camelize([key, name]), column)})
        }
      });
    },
  });
}

export const metatable =<TypeName extends string>(type: NexusObjectTypeDef<TypeName>, name: string, columns: IColumn) => {
  return {
    args: {
      limit: intArg(),
      cursor: stringArg(),
      // sort: arg({ type: getSortObjectType(`${name}PaginationSort`, columns) }),
      filters: arg({ type: getFilterObjectType(`${name}PaginationFilter`, columns) }),
    },
    type: objectType({
      name,
      definition: (t) => {
        t.field("nodes", { type, list: [false], nullable: true });
        t.field("columns", { type: columnDefinition(`${name}Column`, columns), resolve: () => columns });
        t.string("cursor", { nullable: true });
        t.int("count");
      },
    })
  }
}
