import { enumType, objectType, inputObjectType } from "@nexus/schema";
import { IColumnClassic } from './interfaces';
import { getOperators } from './metatable';

export const Sort = enumType({
  name: "Sort",
  members: ["ASC", "DESC"],
});

const StringFilterOperator = enumType({
  name: "StringFilterOperator",
  members: ["EQ", "LIKE"],
});

const StringFilterFilter = inputObjectType({
  name: "StringFilterFilter",
  definition: (t) => {
    t.string("value", { nullable: true });
    t.field("operator", { type: StringFilterOperator, nullable: true, default: "LIKE" });
  },
});

export const StringFilter = inputObjectType({
  name: "StringFilter",
  definition: (t) => {
    t.string("type", { default: "string" });
    t.field("filters", { type: StringFilterFilter, list: true });
  },
});

const NumberFilterOperator = enumType({
  name: "NumberFilterOperator",
  members: ["EQ", "NE", "GT", "GE", "LT", "LE"],
});

const NumberFilterFilter = inputObjectType({
  name: "NumberFilterFilter",
  definition: (t) => {
    t.int("value", { nullable: true });
    t.field("operator", { type: NumberFilterOperator, nullable: true, default: "EQ" });
  },
});

export const NumberFilter = inputObjectType({
  name: "NumberFilter",
  definition: (t) => {
    t.string("type", { default: "number" });
    t.field("filters", { type: NumberFilterFilter, list: true });
  },
});

export const BooleanFilter = inputObjectType({
  name: "BooleanFilter",
  definition: (t) => {
    t.string("type", { default: "boolean" });
    t.boolean("value", { nullable: true });
  },
});

const ColumnType = enumType({
  name: "ColumnType",
  members: ["string", "number", "boolean"],
});

export const Column = objectType({
  name: "Column",
  definition: (t) => {
    t.field("type", { type: ColumnType });
    t.string("name");
    t.string("label", { nullable: true });
    t.string("path", { nullable: true });
    t.string("sortOptions", { nullable: true, list: [false], resolve: (column: IColumnClassic) => column.isSortable ? ['ASC', 'DESC', null]: [] });
    t.string("filterOperators", { nullable: true, list: [false], resolve: (column: IColumnClassic) => column.isFilterable ? getOperators(column) : [] });
  },
});

