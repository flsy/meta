import { IPaginatorArguments } from '../interfaces';
import { decodeCursor } from '../paginate/paginate';
import { Condition, mapToCondition } from '../mapping';
import { firstKeyValue, firstValue } from '../helpers';
import { Optional } from '@falsy/metacore';

const getPaginateLimiter = <Entity>(entity: string, args?: IPaginatorArguments<Entity>): Optional<Condition> => {
  if (!args?.cursor) {
    return;
  }

  const decoded = decodeCursor(args.cursor);
  if (!decoded) {
    return;
  }

  const [cursorKey, cursorValue] = firstKeyValue<string>(decoded);

  if (args?.sort) {
    const sortValue = firstValue(args.sort);
    if (sortValue === 'DESC') {
      return {
        name: cursorKey,
        entity,
        filters: [{ operator: '<', value: cursorValue }],
      };
    }
  }

  return {
    name: cursorKey,
    entity,
    filters: [{ operator: '>', value: cursorValue }],
  };
};

export const getAllFilters = <Entity>(entity: string, args?: IPaginatorArguments<Entity>): Condition[] => {
  const toReturn = getFilters(entity, args);

  const paginateLimiter = getPaginateLimiter(entity, args);
  if (paginateLimiter) {
    const sameField = toReturn.find((e) => e.name === paginateLimiter.name && paginateLimiter.entity === e.entity);
    if (sameField) {
      return toReturn.map((r) => {
        if (r.name === paginateLimiter.name) {
          return {
            name: r.name,
            entity,
            filters: [...r.filters, ...paginateLimiter.filters],
          };
        }
        return r;
      });
    } else {
      toReturn.push(paginateLimiter);
    }
  }

  return toReturn;
};

export const getFilters = <Entity>(entity: string, args?: IPaginatorArguments<Entity>): Condition[] => {
  if (!args?.filters) {
    return [];
  }

  return Object.entries<any>(args.filters).reduce<any>((all, [name, filter]) => [...all, mapToCondition(name, entity, filter)], []);
};
