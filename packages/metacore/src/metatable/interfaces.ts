import { MetaField } from '../metaforms/interfaces';

export type Column<TTypes> = { type?: TTypes; label?: string; key?: boolean; isOmitted?: boolean; filterForm?: MetaField[]; sortForm?: { name: string, type: 'sort', value?: 'ASC' | 'DESC' }[] };
export type Columns<TTypes> = { [key: string]: Column<TTypes> | Columns<TTypes> };
export type OneOrMany<T> = T | Array<T>;
