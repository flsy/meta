import { IColumnBody, ITable } from '../interfaces';
import { IForm } from 'metaforms';

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];

interface INumberInput {
  type: 'number';
  placeholder?: string;
  label?: string;
  value?: string;
}

interface IStringInput {
  type: 'string';
  placeholder?: string;
  label?: string;
  value?: number;
}

interface ICheckboxInput {
  type: 'checkbox';
  placeholder?: string;
  label?: string;
  value?: boolean;
}

interface ISubmitInput {
  type: 'submit';
  label?: string;
}

type IFilterForm = IForm<{ submit: ISubmitInput }>

type INumberForm<Name extends string> = IForm<{ [key in Name]: INumberInput } & IFilterForm>
type IStringForm<Name extends string> = IForm<{ [key in Name]: IStringInput } & IFilterForm>
type IBooleanForm<Name extends string> = IForm<{ [key in Name]: ICheckboxInput } & IFilterForm>


interface INumberColumn<Name extends string> extends IColumnBody<INumberForm<Name>> {
  type: 'number';
}

interface IStringColumn<Name extends string>  extends IColumnBody<IStringForm<Name>> {
  type: 'string';
}

interface IBooleanColumn<Name extends string> extends IColumnBody<IBooleanForm<Name>> {
  type: 'boolean';
}

export type IPhotoTable = ITable<{ id: INumberColumn<'id'>; title: IStringColumn<'title'>; isPublished: IBooleanColumn<'isPublished'>; }>;
export type INameTable = ITable<{ id: INumberColumn<'id'>; firstName: IStringColumn<'firstName'>; lastName: IStringColumn<'lastName'>; }>;

export type IAuthorTable = ITable<{ id: INumberColumn<'id'>; credit: INumberColumn<'credit'>, name: INameTable; photo: IPhotoTable }>
