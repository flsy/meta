import { FilterType, Filters, IStringInput, IStringsInput, IBooleanInput, INumberInput } from 'packages/metacore/lib';

export const isFilterType = (filter: FilterType | Filters): filter is FilterType => Object.prototype.hasOwnProperty.call(filter, 'type');
export const isIStringInput = (filter?: FilterType | Filters): filter is IStringInput => filter ? isFilterType(filter) && filter?.type === 'string' : false;
export const isIStringsInput = (filter?: FilterType | Filters): filter is IStringsInput => filter ? isFilterType(filter) && filter?.type === 'strings': false;
export const isIBooleanInput = (filter?: FilterType | Filters): filter is IBooleanInput => filter ? isFilterType(filter) && filter?.type === 'boolean': false;
export const isINumberInput = (filter?: FilterType | Filters): filter is INumberInput => filter ? isFilterType(filter) && filter?.type === 'number': false;
