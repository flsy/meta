export type IColumnNested = { path: string, value: IColumn[] };

export type IColumnClassic = {
  type: "string" | "number" | "boolean";
  name: string;
  label?: string;
  path?: string;
  isSortable?: boolean;
  isFilterable?: boolean;
};

export type IColumn = IColumnClassic | IColumnNested
