import {
  Column,
  Columns,
  IMetaFiltersArgs,
  OneOrMany,
  IStringInput,
  MetaField,
} from '@falsy/metacore';
import { defaultTo, head, isNil, lensPath, prop, set, view, when } from 'ramda'
import { getFieldProperty } from 'metaforms'

export const getCellValue =
  <TRow>(bits: string[]) =>
  (object: TRow): OneOrMany<any> => {
    const [property, ...rest] = bits;

    if (!property) {
      return object;
    }

    const value = prop<string, any>(property)(object);
    if (Array.isArray(value)) {
      return value.map((v) => getCellValue(rest)(v));
    }
    if (value && head(rest)) {
      return getCellValue(rest)(value);
    }
    return value;
  };

export const isColumn = <TTypes>(column: Column<TTypes> | Columns<TTypes>): column is Column<TTypes> => typeof column.type === 'string';
export const getColumnPaths = <TColumns extends Columns<TTypes>, TTypes>(columns: TColumns, parentKey: string[] = []): string[][] =>
  Object.entries(columns).reduce((acc, [name, column]) => {
    if (isColumn(column)) {
      return [...acc, [...parentKey, name]];
    }

    return [...acc, ...getColumnPaths(column, [...parentKey, name])];
  }, []);

export const findColumnPath =
  <TColumns extends Columns<TTypes>, TTypes>(find: (column: Column<TTypes>) => boolean) =>
  (columns: TColumns): string[] =>
    defaultTo(
      [],
      getColumnPaths(columns).find((colPath) => find(view(lensPath(colPath))(columns))),
    );

export const filterColumnPaths =
  <TColumns extends Columns<TTypes>, TTypes>(filter: (column: Column<TTypes>) => boolean) =>
  (columns: TColumns): string[][] =>
    defaultTo(
      [],
      getColumnPaths(columns).filter((colPath) => filter(view(lensPath(colPath), columns))),
    );

export const unsetAllSortFormValues = <TTypes>(columns: Columns<TTypes>): Columns<TTypes> => {
  return getColumnPaths(columns).reduce((acc, colPath) => {
    const columnSortFormLens = lensPath([...colPath, 'sortForm']);
    const columnSortForm = view(columnSortFormLens, columns);

    if (columnSortForm) {
      return set(columnSortFormLens, columnSortForm.map(field => ({ ...field, value: undefined })), acc);
    }

    return acc;
  }, columns);
};

export const getColumnFilterTypePath = (columnPath: string[]) => `${columnPath.join('.')}.type`;
export const getColumnFilterValuePath = (columnPath: string[]) => `${columnPath.join('.')}.value`;
export const getColumnFilterFiltersPath = (columnPath: string[]) => `${columnPath.join('.')}.filters`;

export const toMetaFilters = <TColumns extends Columns<TTypes>, TTypes>(columns: TColumns): IMetaFiltersArgs => {
  return getColumnPaths(columns).reduce(
    (acc, columnPath) => {
      const columnFilterForm = view(lensPath([...columnPath, 'filterForm']), columns);
      const columnSortForm = view(lensPath([...columnPath, 'sortForm']), columns);

      const getFieldValue = getFieldProperty('value');

      const columnFilterType = getFieldValue(getColumnFilterTypePath(columnPath), columnFilterForm);
      const columnFilterValue = getFieldValue(getColumnFilterValuePath(columnPath), columnFilterForm);
      const columnsFilterFilters = getFieldValue( getColumnFilterFiltersPath(columnPath), columnFilterForm);

      const filters = when(() => columnFilterType,
        set(lensPath(columnPath), {
          type: columnFilterType,
          ...!isNil(columnsFilterFilters) && {filters: columnsFilterFilters },
          ...!isNil(columnFilterValue) && { value: columnFilterValue },
        })
      )(acc.filters);

      const columnSortFormValue = getFieldValue(columnPath.join('.'), columnSortForm);

      const sort = when(() => columnSortFormValue,
        set(lensPath(columnPath), columnSortFormValue)
      )(acc.sort);

      return { filters, sort };
    },
    { filters: {}, sort: {} },
  );
};

type Options = { value?: IStringInput['filters'], label?: string, submit?: MetaField };

const filter = <T>(array: Array<T | undefined>): T[] => array.filter((value) => !!value);

export const getStringFilter = (path: string[], options?: Options): MetaField[] =>
  filter([{
      name: getColumnFilterTypePath(path),
      type: 'hidden',
      value: 'string',
    },
    {
      name: getColumnFilterFiltersPath(path),
      type: 'text',
      label: options?.label,
      value: options?.value,
    },
    options?.submit,
  ])
