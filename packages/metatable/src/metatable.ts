import { arg, inputObjectType, intArg, objectType, stringArg } from '@nexus/schema';
import { BooleanFilter, Column, NumberFilter, Sort, StringFilter } from './types';
import { IColumn } from './interfaces';
import { NexusObjectTypeDef } from '@nexus/schema/dist/definitions/objectType';
import { capitalize, toTree } from './tools';

export const getOperators = (column: IColumn): Array<string | null> => {
  switch (column.type) {
    case 'string':
      return ["EQ", "LIKE", null]
    case 'number':
      return ["EQ", "NE", "GT", "GE", "LT", "LE", null]
    default:
      return []
  }
}

const getFilterType = (column: InternalColumn) => {
  switch (column.type){
    case 'number':
      return NumberFilter;
    case 'string':
      return StringFilter
    case 'boolean':
      return BooleanFilter;
  }
}

type InternalColumn = Omit<IColumn, 'path'>

const isInternalColumn = (column: InternalStructure | InternalColumn): column is InternalColumn => !!column.type;

export interface InternalStructure {
  [key: string]: InternalColumn | InternalStructure
}


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

const getNestedType = (name: string, column: InternalStructure) => inputObjectType({
    name: `${capitalize(name)}Filter`,
    definition(t) {
      Object.entries(column).forEach(([key, value]) => {
        if (isInternalColumn(value)) {
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

const getFilterObjectType = (name: string, columns: IColumn[]) => inputObjectType({
    name,
    definition: (t) => {
      Object.entries(toTree(columns)).forEach(([key, column]) => {
        if (isInternalColumn(column)) {
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

export const metatable =<TypeName extends string>(type: NexusObjectTypeDef<TypeName>, name: string, columns: IColumn[]) => {
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
        t.field("columns", { type: Column, list: [false], resolve: () => columns });
        t.string("cursor", { nullable: true });
        t.int("count");
      },
    })
  }
}
