import {MetaField} from "@falsy/metacore";

export type Column = {
  type?: string;
  label?: string;
  key?: boolean;
  width?: number;
  filterForm?: MetaField[];
  sortForm?: MetaField[];
};

export type Columns = {
  [key: string]: Column | Columns;
};

export type InternalColumn = {
  name: string[];
  flatName: string;
  type: Column['type'];
  label: string;
  sortForm?: Column['sortForm'];
  filterForm?: Column['filterForm'];
  key?: Column['key'];
  width?: Column['width'];
};
