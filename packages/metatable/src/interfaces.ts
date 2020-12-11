import { ReactNode } from 'react';

export type Column<TTypes> = { type?: TTypes; label?: string; key?: boolean; isOmitted?: boolean; filterForm?: any; sortForm?: any };
export type Columns<TTypes> = { [key: string]: Column<TTypes> | Columns<TTypes> };

export type OneOrMany<T> = T | Array<T>;
export type ITr<Row> = ({ row, children }: { children: ReactNode; row: Row }) => JSX.Element;
export type IHeadTr = ({ children }: { children: ReactNode }) => JSX.Element;
export type ITd<TTypes> = ({ value, type }: { value: OneOrMany<string | number | boolean>, type: TTypes }) => JSX.Element;

export type ITh<Type> = { (props: { columns: Columns<Type>; columnPath: string[] }): JSX.Element };
export type ITbody = { (props: { columnPaths: string[][]; children: ReactNode }): JSX.Element };
export type ITfoot = { (props: { colSpan: number }): JSX.Element };
