export type IColumn = {
  type: "string" | "number" | "boolean";
  path: string[];
  label?: string;
  key?: boolean;
  isSortable?: boolean;
  isFilterable?: boolean;
};
