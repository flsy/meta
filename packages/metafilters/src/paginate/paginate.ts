import { Optional, Sort, ValueOf } from '../interfaces';
import { firstKey } from '../helpers';

export const encodeCursor = <Entity>(entity: Entity, sort?: Sort<Entity>): string => {
  const key = sort ? firstKey(sort) : 'id';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return encodeURI(JSON.stringify({ [key]: entity[key] }));
};

export const decodeCursor = <Entity>(cursor: string): Optional<{ [key in keyof Partial<Entity>]: ValueOf<Entity> }> => {
  // if (!cursor) return;
  try {
    return JSON.parse(decodeURI(cursor));
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log('info', 'decode cursor', error.message);
    return;
  }
};
