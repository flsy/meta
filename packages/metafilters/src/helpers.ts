import { SortOrder, SortOrderNested } from "./interfaces";

export const tail = <T>(array: T[]) => [...array].pop();
export const head: <T>(array: T[]) => T = (array) => array[0];

export const firstKeyValue = <T>(obj: { [key: string]: T }): [string, T] => head(Object.entries(obj));
export const firstValue = <T>(obj: { [key: string]: T }): T => head(Object.values(obj));
export const firstKey = <T>(obj: { [key: string]: T }): string => head(Object.keys(obj));

export const isFinalSortOrder = <Entity>(order: SortOrderNested<Entity>): order is SortOrder => order === "ASC" || order === "DESC";
