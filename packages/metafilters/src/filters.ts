import { Filters, IBooleanInput, INumberInput, IStringInput, IStringsInput, Nullable, Operator } from '@falsy/metacore';
import { Column, getColumnDbName, prepareColumnName } from './tools';

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
    case 'EMPTY': {
      return `${columnName} is null`;
    }
    case 'NONEMPTY': {
      return `${columnName} is not null`;
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
  case 'EMPTY': {
    return `${columnName} is null`;
  }
  case 'NONEMPTY': {
    return `${columnName} is not null`;
  }
  case 'LIKE':
  default: {
    // TODO Zde by měly být rozlišeny dva stavy. 
    // Stav kdy filtruju NULL a chci videt NULL zaznamy. 
    // A stav kdy nefiltruju NIC a chci videt VSECHNY zaznamy.  
    // Momentalne nelze vyfiltrovat pouze NULL zaznamy. 

    // This coalesce includes null values into the result.
    return `coalesce(${columnName}, '') like '%${value || ''}%'`;
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
  
  // TODO Zde by měly být rozlišeny dva stavy. 
  // Stav kdy filtruju NULL a chci videt NULL zaznamy. 
  // A stav kdy nefiltruju NIC a chci videt VSECHNY zaznamy.  
  // Momentalne nelze vyfiltrovat pouze NULL zaznamy. 
  if (filter.value === null) {
    return `${columnName} = NULL OR ${columnName} = false OR ${columnName} = true`;
  }
  return [columnName, '=', filter.value].join(' ');
};

export const whereFilters = (filters: Filters, columns: Column[] = []): string[] => {
  return Object.entries(filters).reduce<string[]>((all, [name, filter]) => {
    const columnDbName = getColumnDbName(columns, name);
    switch (filter?.type) {
    case 'string':
      return [...all, ...stringFilter(columnDbName, filter)];
    case 'strings':
      return [...all, ...stringsFilter(columnDbName, filter)];
    case 'number':
      return [...all, ...numberFilter(columnDbName, filter)];
    case 'boolean':
      return [...all, booleanFilter(columnDbName, filter)];
    default:
      return all;
    }
  }, []);
};
