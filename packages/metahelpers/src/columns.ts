import {Columns} from "@falsy/metacore";
import {FilterResult} from "./filters";

// todo: nested columns
export const columnBuilder = <T extends string>() => {

    const columns: Columns<'string' | 'boolean' | 'number' | T> = {}

    return {
        addStringColumn: (name: string, options: { label: string, filterForm?: FilterResult<'string'>, withSortForm?: boolean }) => {
            columns[name] = {
                type: "string",
                label: options.label,
                filterForm: options.filterForm,
                sortForm: options.withSortForm ? [ { name, type: "sort"} ] : undefined
            }
            return {...columnBuilder(), columns }
        },
        addBooleanColumn: (name: string, options: { label: string, filterForm?: FilterResult<'boolean'>, withSortForm?: boolean  }) => {
            columns[name] = {
                type: 'boolean',
                label: options.label,
                filterForm: options.filterForm,
                sortForm: options.withSortForm ? [ { name, type: "sort"} ] : undefined
            }
            return {...columnBuilder(), columns }
        },
        addNumberColumn: (name: string, options: { label: string, filterForm?: FilterResult<'number'>, withSortForm?: boolean }) => {
            columns[name] = {
                type: 'number',
                label: options.label,
                filterForm: options.filterForm,
                sortForm: options.withSortForm ? [ { name, type: "sort"} ] : undefined
            }
            return {...columnBuilder(), columns }
        },
        addColumn: (name: string, options: { label: string, type: T, filterForm?: FilterResult<T>, withSortForm?: boolean }) => {
            columns[name] = {
                type: options.type,
                label: options.label,
                filterForm: options.filterForm,
                sortForm: options.withSortForm ? [ { name, type: "sort"} ] : undefined
            }
            return {...columnBuilder(), columns }
        }
    }

}