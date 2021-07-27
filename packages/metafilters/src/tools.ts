import { Nullable } from '@falsy/metacore';
import { pipe } from 'fputils';

export const escape = (s: string) => `"${s}"`;
const useCustomFunction =
  (fn?: Nullable<string>) =>
  (s: string): string =>
    fn ? `${fn}(${s})` : s;
export const prepareColumnName = (columnName: string, customFunctionName?: Nullable<string>) =>
  pipe(columnName, escape, useCustomFunction(customFunctionName));
