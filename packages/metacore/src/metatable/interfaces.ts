import { Field } from '../metaforms/interfaces';

export type Column<TTypes> = { type?: TTypes; label?: string; key?: boolean; isOmitted?: boolean; filterForm?: Field; sortForm?: Field };
export type Columns<TTypes> = { [key: string]: Column<TTypes> | Columns<TTypes> };
export type OneOrMany<T> = T | Array<T>;
