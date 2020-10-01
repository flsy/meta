import { arg, inputObjectType, intArg, objectType, stringArg } from '@nexus/schema';
import { BooleanFilter, Column, NumberFilter, Sort, StringFilter } from './types';
import { IColumn, IColumnClassic, IColumnNested } from './interfaces';
import { NexusObjectTypeDef } from '@nexus/schema/dist/definitions/objectType';

const isNestedColumn = (column: IColumn): column is IColumnNested => !!column.path

export const getOperators = (column: IColumnClassic): Array<string | null> => {
  switch (column.type) {
    case 'string':
      return ["EQ", "LIKE", null]
    case 'number':
      return ["EQ", "NE", "GT", "GE", "LT", "LE", null]
    default:
      return []
  }
}

const getFilterType = (column: IColumnClassic) => {
  switch (column.type){
    case 'number':
      return NumberFilter;
    case 'string':
      return StringFilter
    case 'boolean':
      return BooleanFilter;
  }
}


const getFilterObjectType = (name: string, columns: IColumn[]) => inputObjectType({
  name,
  definition: (t) => {
    columns.forEach(column => {
      if (isNestedColumn(column)) {
        t.field(column.path, { type: getFilterObjectType(`${name}${column.path}`, column.value), nullable: true });
      } else {
        const type = getFilterType(column)
        if (type) {
          t.field(column.name, { type, nullable: true });
        }
      }

    })

  },
});

const getSortObjectType = (name: string, columns: IColumn[]) => inputObjectType({
  name,
  definition: (t) => {
    columns.forEach(column => {
      if (isNestedColumn(column)) {
        t.field(column.path, { type: getSortObjectType(`${name}${column.path}`, column.value) });
      } else {
        t.field(column.name, { type: Sort });
      }
    })
  },
});

const toClassicColumns = (columns: IColumn[] = []): IColumnClassic[] =>
  columns.reduce<IColumnClassic[]>((all, current) => {
    if (isNestedColumn(current)) {
      return [...all, ...toClassicColumns(current.value).map(column => ({ ...column, path: current.path }))]
    }

    return [...all, current];
  }, [])


export const metatable =<TypeName extends string>(type: NexusObjectTypeDef<TypeName>, name: string, columns: IColumn[]) => {
  return {
    args: {
      limit: intArg(),
      cursor: stringArg(),
      sort: arg({ type: getSortObjectType(`${name}PaginationSort`, columns) }),
      filters: arg({ type: getFilterObjectType(`${name}PaginationFilter`, columns) }),
    },
    type: objectType({
      name,
      definition: (t) => {
        t.field("nodes", { type, list: [false], nullable: true });
        t.field("columns", { type: Column, list: [false], resolve: () => toClassicColumns(columns) });
        t.string("cursor", { nullable: true });
        t.int("count");
      },
    })
  }
}
