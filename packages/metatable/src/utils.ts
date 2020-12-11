import { Column, Columns, OneOrMany } from './interfaces';
import {
  defaultTo, has,
  head,
  isNil,
  lensPath,
  mergeRight,
  not,
  pipe,
  prop,
  set,
  view,
  when,
} from 'ramda';
import { getFormData } from 'metaforms';

export const getCellValue = <TRow>(bits: string[]) => (object: TRow): OneOrMany<any> => {
  const [property, ...rest] = bits;
  const value = prop<string, any>(property)(object);
  if (Array.isArray(value)) {
    return value.map((v) => getCellValue(rest)(v));
  }
  if (value && head(rest)) {
    return getCellValue(rest)(value);
  }
  return value;
};

export const renderValue = (value: OneOrMany<string | number | boolean>): string => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return value.toString();
};

export const isColumn = <TTypes>(column: Column<TTypes> | Columns<TTypes>): column is Column<TTypes> => typeof column.type === 'string';
export const getColumnPaths = <TColumns extends Columns<TTypes>, TTypes>(columns: TColumns, parentKey: string[] = []): string[][] =>
  Object.entries(columns).reduce((acc, [name, column]) => {
    if (isColumn(column)) {
      return [...acc, [...parentKey, name]];
    }

    return [...acc, ...getColumnPaths(column, [...parentKey, name])];
  }, []);

export const findColumnPath = <TColumns extends Columns<TTypes>, TTypes>(find: (column: Column<TTypes>) => boolean) => (columns: TColumns): string[] =>
  defaultTo([], getColumnPaths(columns).find((colPath) => find(view(lensPath(colPath))(columns))));

export const filterColumnPaths = <TColumns extends Columns<TTypes>, TTypes>(filter: (column: Column<TTypes>) => boolean) => (columns: TColumns): string[][] =>
  defaultTo([], getColumnPaths(columns).filter((colPath) => filter(view(lensPath(colPath), columns))));


// eslint-disable-next-line @typescript-eslint/ban-types
export const getSortFormPath = (fields?: object): string[] => {
  return Object.entries(fields || {}).reduce((acc, [key, value]) => {
    if(has('type', value) && prop('type', value) === 'sort') {
      return [...acc, key];
    }

    if(value && typeof value === 'object') {
      return [key, ...getSortFormPath(value)];
    }

    return acc;
  }, [])
}

const unsetAllSortFormValues = <TColumns extends Columns<TTypes>, TTypes>(columns: TColumns): TColumns => {
  return getColumnPaths(columns).reduce((acc, colPath) => {
    const columnSortFormLens = lensPath([...colPath, 'sortForm']);
    const columnSortForm = view(columnSortFormLens, columns);

    if(columnSortForm) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      return set(lensPath([...colPath, 'sortForm', ...getSortFormPath(columnSortForm as object), 'value']), undefined, acc);
    }

    return acc;
  }, columns)
}

export const setSortFormValue = <TColumns extends Columns<TTypes>, TTypes, TValue>(columnPath: string[], value: TValue, columns: TColumns): TColumns=> {
  const columnSortFormLens = lensPath([...columnPath, 'sortForm']);
  const columnSortForm = view(columnSortFormLens, columns);

  if(columnSortForm) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const sortFormValueLens = lensPath([...columnPath, 'sortForm', ...getSortFormPath(columnSortForm as object), 'value'])
    return pipe(
      unsetAllSortFormValues,
      set(sortFormValueLens, value)
    )(columns)
  }
  return columns;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const toMetaFilters = <TColumns extends Columns<TTypes>, TTypes>(columns: TColumns): { filters: object; sort: object } => {
  return getColumnPaths(columns).reduce((acc, columnPath) => {
    const columnFilterForm = view(lensPath([...columnPath, 'filterForm']), columns);
    const columnSortForm = view(lensPath([...columnPath, 'sortForm']), columns);

    const filterFormData = when(
      pipe(isNil, not),
      getFormData
    )(columnFilterForm);

    const sortFormData = when(
      pipe(isNil, not),
      getFormData
    )(columnSortForm);

    const filters = mergeRight(acc.filters, filterFormData);
    const sort = mergeRight(acc.sort, sortFormData);

    return { filters, sort };
  }, { filters: {}, sort: {} });
};


// eslint-disable-next-line @typescript-eslint/ban-types
const setNestedForm = (path: string[], form: object) => {
  const pathWFields = path.reduce((acc, p) => [...acc, p, 'fields'], [])

  const o = pathWFields.reduce((result, p, i) => {
    if(p === 'fields') {
      const currPath = pathWFields.slice(0, i);
      return set(lensPath(currPath), { type: 'group' }, result);
    }

    return result;
  }, {})


  return set(lensPath(pathWFields), form, o);
}


type StringFilterValue = Array<{ operator: 'EQ' | 'LIKE', value: string }>;
export const getStringFilter = (path: string[], value: StringFilterValue) =>
  setNestedForm(path, {
    type: {
      type: 'hidden',
      value: 'string',
    },
    filters: {
      type: 'string-filter',
      value
    },
    submit: {
      type: 'submit',
      label: 'submit',
    },
  })