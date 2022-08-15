import {
    Column,
    Columns, Filters, FilterType, IBooleanInput,
    IMetaFiltersArgs, INumberInput, IStringInput, IStringsInput, MetaField,
    OneOrMany,
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

const filterFormValues = (filterForm: MetaField[]) : FilterType => {
    const type = filterForm.find(field => field.name.endsWith('.type'))?.value
    const value = filterForm.find(field => field.name.endsWith('.filters'))?.value
    const operator = filterForm.find(field => field.name.endsWith('.options'))?.value

    if (type === 'string') {
        const result: IStringInput = {
            type: 'string',
            filters: [{ value, operator }] //todo: this could be more than one
        }
        return result
    }
    if (type === 'strings') {
        const result: IStringsInput = {
            type: 'strings',
            filters: [{ value, operator }] //todo: this could be more than one
        }
        return result
    }

    if (type === 'boolean') {
        const result: IBooleanInput = {
            type: 'boolean',
            value: value ?? false
        }
        return result
    }

    if (type === 'number') {
        // this is hack for our Datepickers who returns value as [number, number]
        if (Array.isArray(value)) {
            const [gt, lt] = value.sort((a, b) => a - b)
            const result: INumberInput = {
                type: 'number',
                filters: [
                    { value: gt, operator: 'GT' },
                    { value: lt, operator: 'LT' },
                ]
            }
            return result
        }

        const result: INumberInput = {
            type: 'number',
            filters: [{value, operator }] //todo: this could be more than one
        }

        return result
    }
}

export const toMetaFilters = <TColumns extends Columns<TTypes>, TTypes>(columns: TColumns): IMetaFiltersArgs => {
  return getColumnPaths(columns).reduce(
    (acc, columnPath) => {
      const filterForm: MetaField[] = view(lensPath([...columnPath, 'filterForm']), columns);
      const sortForm: MetaField[] = view(lensPath([...columnPath, 'sortForm']), columns);


      const filters: Filters = filterForm && set(lensPath(columnPath), filterFormValues(filterForm), acc.filters);

      const columnSortFormValue = getFieldProperty('value', columnPath.join('.'), sortForm);

      const sort = when(() => columnSortFormValue,
        set(lensPath(columnPath), columnSortFormValue)
      )(acc.sort);

      return { filters, sort };
    },
    { filters: {}, sort: {} },
  );
};
