import { Nullable } from '@falsy/metacore';
import { pipe } from 'fputils';

export type Column = string | [string, string]

export const escape = (s: string) => `"${s}"`;

const useCustomFunction =
  (fn?: Nullable<string>) =>
    (s: string): string =>
      fn ? `${fn}(${s})` : s;

export const prepareColumnName = (columnName: string, customFunctionName?: Nullable<string>) =>
  pipe(columnName, escape, useCustomFunction(customFunctionName));

export const columnsToQuery = (columns: Column[]): string => {
  return columns.map((column) => {
    if(Array.isArray(column)) {
      return `${escape(column[0])} as ${escape(column[1])}`;
    }

    return escape(column);
  }).join(', ');
};

export const getColumnDbName = (columns: Column[], name: string): string => {
  const found = columns.find(column => {
    if(Array.isArray(column)) {
      const [, alias] = column;
      return alias === name;
    }

    return false;
  });

  if(found) {
    return found[0];
  }

  return name;
};
