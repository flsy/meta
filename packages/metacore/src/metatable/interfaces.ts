import { MetaField } from '../metaforms/interfaces';

export type Column<TTypes> = { type?: TTypes; label?: string; key?: boolean; isOmitted?: boolean; filterForm?: MetaField[]; sortForm?: MetaField[]; textNoWrap?: boolean };
export type Columns<TTypes> = { [key: string]: Column<TTypes> | Columns<TTypes> };
export type OneOrMany<T> = T | Array<T>;
