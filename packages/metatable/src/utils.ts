import { Column, Columns, IMetaFiltersArgs, OneOrMany, IStringInput, FieldBody, IBooleanInput, INumberInput } from '@falsy/metacore';
import { defaultTo, has, head, isNil, lensPath, mergeRight, not, path, pipe, prop, set, view, when } from 'ramda';
import { Field, getFormData } from 'metaforms';

export const getCellValue = <TRow>(bits: string[]) => (object: TRow): OneOrMany<any> => {
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

export const findColumnPath = <TColumns extends Columns<TTypes>, TTypes>(find: (column: Column<TTypes>) => boolean) => (
  columns: TColumns,
): string[] =>
  defaultTo(
    [],
    getColumnPaths(columns).find((colPath) => find(view(lensPath(colPath))(columns))),
  );

export const filterColumnPaths = <TColumns extends Columns<TTypes>, TTypes>(filter: (column: Column<TTypes>) => boolean) => (
  columns: TColumns,
): string[][] =>
  defaultTo(
    [],
    getColumnPaths(columns).filter((colPath) => filter(view(lensPath(colPath), columns))),
  );

const setSortFormValue = (sortForm: Field | FieldBody): Field => {
  return Object.entries(sortForm).reduce((acc, [key, field]) => {
    if (has('type', field) && prop('type', field) === 'sort') {
      return { ...acc, [key]: { ...field, value: undefined } };
    }

    if (field && typeof field === 'object') {
      return { ...acc, [key]: { ...field, ...setSortFormValue(field) } };
    }

    return acc;
  }, {});
};

export const unsetAllSortFormValues = <TTypes>(columns: Columns<TTypes>): Columns<TTypes> => {
  return getColumnPaths(columns).reduce((acc, colPath) => {
    const columnSortFormLens = lensPath([...colPath, 'sortForm']);
    const columnSortForm = view(columnSortFormLens, columns);

    if (columnSortForm) {
      return set(columnSortFormLens, setSortFormValue(columnSortForm), acc);
    }

    return acc;
  }, columns);
};

export const getFilterFormValue = (
  filterForm?: Field | FieldBody,
): IBooleanInput['value'] | INumberInput['filters'] | IStringInput['filters'] => {
  return Object.values(filterForm || {}).reduce((acc, field) => {
    const filterType = path(['type', 'value'], field);

    if (filterType === 'string' || filterType === 'number') {
      return path(['filters', 'value'], field);
    }

    if (filterType === 'boolean') {
      return prop('value', field);
    }

    if (field && typeof field === 'object') {
      return getFilterFormValue(field);
    }

    return acc;
  }, undefined);
};

export const toMetaFilters = <TColumns extends Columns<TTypes>, TTypes>(columns: TColumns): IMetaFiltersArgs => {
  return getColumnPaths(columns).reduce(
    (acc, columnPath) => {
      const columnFilterForm = view(lensPath([...columnPath, 'filterForm']), columns);
      const columnSortForm = view(lensPath([...columnPath, 'sortForm']), columns);

      const filterFormData = when(pipe(isNil, not), getFormData)(columnFilterForm);

      const sortFormData = when(pipe(isNil, not), getFormData)(columnSortForm);

      const filters = mergeRight(acc.filters, filterFormData);
      const sort = mergeRight(acc.sort, sortFormData);

      return { filters, sort };
    },
    { filters: {}, sort: {} },
  );
};

const setNestedForm = (path: string[], form: Field): Field => {
  const pathWFields = path.reduce((acc, p) => [...acc, p, 'fields'], []);

  const o = pathWFields.reduce((result, p, i) => {
    if (p === 'fields') {
      const currPath = pathWFields.slice(0, i);
      return set(lensPath(currPath), { type: 'group' }, result);
    }

    return result;
  }, {});

  return set(lensPath(pathWFields), form, o);
};

type Options = { submitLabel?: string; label?: string };
export const getStringFilter = (path: string[], value?: IStringInput['filters'], options?: Options): Field =>
  setNestedForm(path, {
    type: {
      type: 'hidden',
      value: 'string',
    },
    filters: {
      type: 'text',
      label: options?.label,
      value,
    },
    submit: {
      type: 'submit',
      label: options?.submitLabel || 'submit',
    },
  });
