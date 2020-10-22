import { Field, IForm } from 'metaforms';

export interface IColumnBody<Form extends Field = any> {
  type: string;
  label?: string;
  key?: boolean;
  isOmitted?: boolean;
  // isSortable?: boolean;
  // isFilterable?: boolean;
  filterForm?: IForm<Form>;
}

export type IColumn<Form extends Field = any> = {
  [name: string]: IColumnBody<Form>| IColumn<Form>
};

export type ITable<T extends IColumn<Field>> = T;
