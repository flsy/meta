import {
    Column,
    Columns, FilterType, IBooleanInput,
    IMetaFiltersArgs, INumberInput, IStringInput, IStringsInput, MetaField,
    OneOrMany, Operator, Optional,
} from '@falsy/metacore';
import { defaultTo, head, lensPath, prop, set, view, when } from 'ramda'
import { getFieldProperty } from 'metaforms';

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

const getValue = <T>(searchString: '.type' | '.filters' | '.options' | '.value', form: MetaField[]): Optional<T> => (form as any)?.find(field => field.name.endsWith(searchString))?.value

const formType = (filterForm: MetaField[]): 'string' | 'strings' | 'boolean' | 'number'  => getValue('.type', filterForm);
const formValue = <T>(filterForm: MetaField[]): Optional<T> => getValue('.filters', filterForm);
const formOptions = <T>(filterForm: MetaField[]): T => getValue('.options', filterForm);

const stringFilter = (form: MetaField[]): IStringInput => {
    const value = formValue<string>(form);
    const operator = formOptions<Operator>(form)
    if (!is(formValue<any>(form))) return;

    return {
        type: 'string',
        filters: [{ value, operator }] //todo: this could be more than one option
    }
}

const stringsFilter = (form: MetaField[]): IStringsInput => {
    const value = formValue<string>(form);
    const operator = formOptions<'EQ'>(form)
    if (!is(formValue<any>(form))) return;
    return {
        type: 'strings',
        filters: [{ value, operator }] //todo: this could be more than one option
    }
}
const booleanFilter = (form: MetaField[]): IBooleanInput => {
    const value = formValue<boolean>(form);
    if (!is(value)) return;
    return {
        type: 'boolean',
        value: value ?? false
    }
}
const numberFilter = (form: MetaField[]): INumberInput => {
    const value = formValue<number>(form);
    const operator = formOptions<Operator>(form)
    if (!is(formValue<any>(form))) return;

    // this is hack for our Datepickers who returns value as [number, number]
    if (Array.isArray(value)) {
        const [gt, lt] = value.sort((a, b) => a - b)
        return  {
            type: 'number',
            filters: [
                { value: gt, operator: 'GT' },
                { value: lt, operator: 'LT' },
            ]
        }
    }

    return {
        type: 'number',
        filters: [{value, operator }] //todo: this could be more than one
    }
}

const filterFormValues = (filterForm: MetaField[]): FilterType => {
    switch (formType(filterForm)) {
        case "string":
            return stringFilter(filterForm)
        case "strings":
            return stringsFilter(filterForm)
        case "boolean":
            return booleanFilter(filterForm)
        case 'number':
        return numberFilter(filterForm)
    }
}

const is = <T>(value: T | undefined | null): value is T => value !== undefined && value !== null;

export const toMetaFilters = <TColumns extends Columns<TTypes>, TTypes>(columns: TColumns): IMetaFiltersArgs => {
  return getColumnPaths(columns).reduce(
    (acc, columnPath) => {
      const filterForm: MetaField[] = view(lensPath([...columnPath, 'filterForm']), columns);
      const filters = filterFormValues(filterForm);

      const sortForm: MetaField[] = view(lensPath([...columnPath, 'sortForm']), columns);
      const sortFormValue = getFieldProperty('value', columnPath.join('.'), sortForm);

      return {
          filters: when(() => is(filters),
              set(lensPath(columnPath), filters)
          )(acc.filters),
          sort: when(() => sortFormValue,
              set(lensPath(columnPath), sortFormValue)
          )(acc.sort)
      };
    },
    { filters: {}, sort: {} },
  );
};
