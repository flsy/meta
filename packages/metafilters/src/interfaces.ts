import { FilterType } from '@falsy/metacore';

type UnArray<T> = T extends Array<infer U> ? U : T;
type Await<T> = T extends Promise<infer U> ? U : T;

export type Filter<Entity> = {
  [key in keyof Partial<Entity>]: FilterType | Filter<UnArray<Await<Entity[key]>>>;
};

export type SortOrder = 'ASC' | 'DESC';
export type SortOrderNested<NestedEntity = unknown> = SortOrder | Sort<UnArray<Await<NestedEntity>>>;
export type Sort<Entity> = {
  [key in keyof Partial<Entity>]: SortOrderNested<Entity[key]>;
};

export interface IPaginatorArguments<Entity> {
  limit?: number;
  cursor?: string;
  sort?: Sort<Entity>;
  filters?: Filter<Entity>;
}
