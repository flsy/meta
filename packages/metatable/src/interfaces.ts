export type Column<TTypes> = { type?: TTypes; label?: string; key?: boolean; isOmitted?: boolean; filterForm?: any; sortForm?: any };
export type Columns<TTypes> = { [key: string]: Column<TTypes> | Columns<TTypes> };
export type OneOrMany<T> = T | Array<T>;
