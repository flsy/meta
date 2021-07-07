import { Filters, IBooleanInput, INumberInput, IStringInput, Nullable, Sort } from '@falsy/metacore';
import { pipe } from 'fputils';

export type IColumn = { [key: string]: { type: string; key?: boolean } };

interface IArgs {
  limit?: number;
  page?: number;
  sort?: Sort;
  filters?: Filters;
}

const escape = (s: string) => `"${s}"`;
const useCustomFunction = (fn?: Nullable<string>) => (s: string): string => (fn ? `${fn}(${s})` : s);
const prepareColumnName = (columnName: string, customFunctionName?: Nullable<string>) =>
  pipe(columnName, escape, useCustomFunction(customFunctionName));

const numberFilter = (name: string, filter: INumberInput): string[] =>
  (filter.filters || []).map(({ operator, value, customFunction }) => {
    const columnName = prepareColumnName(name, customFunction);
    switch (operator) {
      case 'GT':
        return [columnName, '>', value].join(' ');
      case 'LT':
        return [columnName, '<', value].join(' ');
      case 'GE':
        return [columnName, '>=', value].join(' ');
      case 'LE':
        return [columnName, '<=', value].join(' ');
      case 'NE': {
        if (value === null) {
          return [columnName, 'is not null'].join(' ');
        }
        return [columnName, '!=', value].join(' ');
      }
      case 'EQ':
      default:
        if (value === null) {
          return [columnName, 'is null'].join(' ');
        }
        return [columnName, '=', value].join(' ');
    }
  });

const stringFilter = (name: string, filter: IStringInput): string[] =>
  (filter.filters || []).map(({ value, operator, customFunction }) => {
    const columnName = prepareColumnName(name, customFunction);
    if (value === null) {
      return `${columnName} is null`;
    }

    if (operator === 'EQ') {
      return `${columnName} = "${value}"`;
    }

    return `${columnName} like "%${value}%"`;
  });

const booleanFilter = (name: string, filter: IBooleanInput): string => {
  const columnName = prepareColumnName(name, filter.customFunction);
  if (filter.value === null) {
    return `${columnName} is null`;
  }
  return [columnName, '=', filter.value].join(' ');
};

const whereFilters = (filters: Filters): string[] => {
  return Object.entries(filters).reduce<string[]>((all, [name, filter]) => {
    switch (filter?.type) {
      case 'string':
        return [...all, ...stringFilter(name, filter)];
      case 'number':
        return [...all, ...numberFilter(name, filter)];
      case 'boolean':
        return [...all, booleanFilter(name, filter)];
      default:
        return all;
    }
  }, []);
};

const getSortKey = (sort?: Sort): string => {
  return Object.entries(sort || {}).reduce((acc, [key, value]) => {
    if (value) {
      return key;
    }

    return acc;
  }, '');
};

const metafilters = <Columns extends IColumn>(columns: Columns, tableName: string, args?: IArgs) => {
  const sortKey = getSortKey(args?.sort);
  const names = Object.keys(columns).map(escape);

  const chunks = [`SELECT ${names.join(', ')}`, `FROM ${escape(tableName)}`];
  const countChunks = [`SELECT COUNT(*) as count`, `FROM ${escape(tableName)}`];
  let wheres: string[] = [];

  if (args && args.filters) {
    wheres = [...wheres, ...whereFilters(args.filters)];
  }

  if (wheres.length) {
    const whereSQL = `WHERE ${wheres.join(' AND ')}`;
    chunks.push(whereSQL);
    countChunks.push(whereSQL);
  }

  if (args && args.sort && sortKey) {
    chunks.push(`ORDER BY ${escape(sortKey)} ${args.sort[sortKey as any]}`);
  }

  if (args && args.limit) {
    chunks.push(`LIMIT ${args.limit}`);

    if (args.page && args.page > 0) {
      chunks.push(`OFFSET ${args.limit * args.page}`);
    }
  }

  return {
    count: `${countChunks.join(' ')};`,
    nodes: `${chunks.join(' ')};`,
  };
};

export default metafilters;
