import {Columns, MetaField} from "@falsy/metacore";

export const columnBuilder = () => {

    const columns: Columns<string> = {}

    return {
        addStringColumn: (name: string, options: { label: string, filterForm?: MetaField[], withSortForm?: boolean }) => {
            columns[name] = {
                type: "string",
                label: options.label,
                filterForm: options.filterForm,
                sortForm: options.withSortForm ? [ { name, type: "sort"} ] : undefined
            }
            return {...columnBuilder(), columns }
        },
        addBooleanColumn: (name: string, options: { label: string, filterForm?: MetaField[], withSortForm?: boolean  }) => {
            columns[name] = {
                type: 'boolean',
                label: options.label,
                filterForm: options.filterForm,
                sortForm: options.withSortForm ? [ { name, type: "sort"} ] : undefined
            }
            return {...columnBuilder(), columns }
        },
        addNumberColumn: (name: string, options: { label: string, filterForm?: MetaField[], withSortForm?: boolean }) => {
            columns[name] = {
                type: 'number',
                label: options.label,
                filterForm: options.filterForm,
                sortForm: options.withSortForm ? [ { name, type: "sort"} ] : undefined
            }
            return {...columnBuilder(), columns }
        }
    }

}