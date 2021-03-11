import { FilterType, IBooleanInput, INumberInput, IStringInput, IStringsInput, Optional } from 'core';
import { SelectQueryBuilder } from 'typeorm';
import { firstKeyValue } from './helpers';

export type Condition = {
  entity: string;
  name: string;
  filters: {
    operator: string;
    value?: string | number | null | boolean | Array<string | null>;
  }[];
};

const mapStringFilterToCondition = (name: string, entity: string, filter: IStringInput): Condition => {
  return {
    name,
    entity,
    filters: filter.filters.map(({ value, operator }) => {
      if (value === null) {
        return { operator: 'is null' };
      }

      if (operator === 'EQ') {
        return { operator: '=', value };
      }

      return { operator: 'like', value: `%${value}%` };
    }),
  };
};

const mapStringsFilterToCondition = (name: string, entity: string, filter: IStringsInput): Condition => ({
  name,
  entity,
  filters: filter.filters.map(({ value, operator }) => {
    if (value === null) {
      return { operator: 'is null' };
    }
    return { operator: 'IN', value };
  }),
});

const mapNumberFilterToCondition = (name: string, entity: string, filter: INumberInput): Condition => {
  return {
    name,
    entity,
    filters: filter.filters.map(({ operator, value }) => {
      switch (operator) {
        case 'GT':
          return { operator: '>', value };
        case 'LT':
          return { operator: '<', value };
        case 'GE':
          return { operator: '>=', value };
        case 'LE':
          return { operator: '<=', value };
        case 'NE': {
          if (value === null) {
            return { operator: 'is not null' };
          }
          return { operator: '!=', value };
        }
        case 'EQ':
        default:
          if (value === null) {
            return { operator: 'is null' };
          }
          return { operator: '=', value };
      }
    }),
  };
};

const mapBooleanFilterToCondition = (name: string, entity: string, filter: IBooleanInput): Condition => {
  if (filter.value === null) {
    return { name, entity, filters: [{ operator: 'is null' }] };
  }
  return { name, entity, filters: [{ operator: '=', value: filter.value }] };
};

export const mapToCondition = (name: string, entity: string, filter: FilterType): Optional<Condition> => {
  switch (filter.type) {
    case 'string':
      return mapStringFilterToCondition(name, entity, filter);
    case 'number':
      return mapNumberFilterToCondition(name, entity, filter);
    case 'boolean':
      return mapBooleanFilterToCondition(name, entity, filter);
    case 'strings':
      return mapStringsFilterToCondition(name, entity, filter);
    default: {
      const [key, value] = firstKeyValue<FilterType>(filter);

      return mapToCondition(key, name, value);
    }
  }
};

const getWhere = (condition: Condition, entity: string) => {
  if (condition.filters.length === 1) {
    const chunks = [`${condition.entity || entity}.${condition?.name}`];
    if (condition.filters[0].operator) {
      chunks.push(condition.filters[0].operator);
    }

    if (condition.filters[0].value !== undefined) {
      if (condition.filters[0].operator === 'IN') {
        chunks.push(`(:...${condition?.name})`);
      } else {
        chunks.push(`(:${condition?.name})`);
      }
    }
    return chunks.join(' ');
  }

  return condition.filters.map((a, i) => `${condition.entity || entity}.${condition.name} ${a.operator} :arg${i + 1}`).join(' AND ');
};

const getParameters = (condition: Condition) => {
  if (condition.filters.length === 1) {
    return condition?.filters[0].value !== undefined ? { [condition.name]: condition.filters[0].value } : {};
  }

  return condition.filters.reduce(
    (all, current, i) => ({
      ...all,
      [`arg${i + 1}`]: current.value,
    }),
    {},
  );
};

export const mapToSql = <Entity>(
  queryBuilder: SelectQueryBuilder<Entity>,
  entity: string,
  inputs?: Condition[],
): SelectQueryBuilder<Entity> => {
  inputs?.forEach((input, index) => {
    const where = getWhere(input, entity);

    const parameters = getParameters(input);

    if (index === 0) {
      queryBuilder.where(where, parameters);
    } else {
      queryBuilder.andWhere(where, parameters);
    }
  });

  return queryBuilder;
};

export const sanitize = <Entity>(result: Entity[]): Entity[] =>
  result.map((row) =>
    Object.entries(row).reduce((all, [key, value]) => {
      // check for relation
      if (key.startsWith('__') && key.endsWith('__')) {
        return { ...all, [key.split('__').join('')]: value };
      }
      return { ...all, [key]: value };
    }, {}),
  ) as any;
