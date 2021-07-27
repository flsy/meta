import { Filters, IBooleanInput, INumberInput, IStringInput, IStringsInput, Nullable, Operator } from '@falsy/metacore';
import { prepareColumnName } from './tools';

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
      case 'LIKE':
        return [columnName, 'like', `'%${value}%'`].join(' ');
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

const stringOperator = (columnName: string, value: Nullable<string>, operator?: Operator) => {
  switch (operator) {
    case 'EQ':
      return `${columnName} = '${value}'`;
    case 'GE':
      return `${columnName} >= '${value}'`;
    case 'LE':
      return `${columnName} <= '${value}'`;
    case 'LT':
      return `${columnName} < '${value}'`;
    case 'GT':
      return `${columnName} > '${value}'`;
    case 'NE': {
      if (value === null) {
        return `${columnName} is not null`;
      }
      return `${columnName} != '${value}'`;
    }
    case 'LIKE':
    default: {
      if (value === null) {
        return `${columnName} is null`;
      }
      return `${columnName} like '%${value}%'`;
    }
  }
};

const stringFilter = (name: string, filter: IStringInput): string[] =>
  (filter.filters || []).map(({ value, operator, customFunction }) => {
    const columnName = prepareColumnName(name, customFunction);
    return stringOperator(columnName, value, operator);
  });

const stringsFilter = (name: string, filter: IStringsInput): string[] => {
  const filters = (filter.filters || []).map(({ customFunction, operator, value }) => {
    const columnName = prepareColumnName(name, customFunction);
    return stringOperator(columnName, value, operator);
  }, []);

  return filters.length ? [filters.join(' OR ')] : [];
};

const booleanFilter = (name: string, filter: IBooleanInput): string => {
  const columnName = prepareColumnName(name, filter.customFunction);
  if (filter.value === null) {
    return `${columnName} is null`;
  }
  return [columnName, '=', filter.value].join(' ');
};

export const whereFilters = (filters: Filters): string[] => {
  return Object.entries(filters).reduce<string[]>((all, [name, filter]) => {
    switch (filter?.type) {
      case 'string':
        return [...all, ...stringFilter(name, filter)];
      case 'strings':
        return [...all, ...stringsFilter(name, filter)];
      case 'number':
        return [...all, ...numberFilter(name, filter)];
      case 'boolean':
        return [...all, booleanFilter(name, filter)];
      default:
        return all;
    }
  }, []);
};
