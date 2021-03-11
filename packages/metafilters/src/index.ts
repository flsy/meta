import { Repository } from "typeorm";
import { IPaginatorArguments, SortOrder, SortOrderNested } from "./interfaces";
import { getAllFilters, getFilters } from "./filters/filters";
import { encodeCursor } from "./paginate/paginate";
import { mapToSql, sanitize } from "./mapping";
import { firstKeyValue, isFinalSortOrder, tail } from "./helpers";

export * from "./interfaces";
export { default as metafilters2 } from "./v2/index";

/**
 *
 * @param {Repository<Entity>} repository
 * @param {IPaginatorArguments<Entity>} args
 * @param {string[]} relations
 * @return {Promise<{count: number, nodes: Entity[], cursor?: string}>}
 */
const metafilters = async <Entity>(
  repository: Repository<Entity>,
  args?: IPaginatorArguments<Entity>,
  relations?: string[]
): Promise<{ count: number; nodes: Entity[]; cursor?: string }> => {
  const entity = "entity";

  const nodesBuilder = repository.createQueryBuilder(entity);
  const countBuilder = repository.createQueryBuilder(entity);

  mapToSql(countBuilder, entity, getFilters(entity, args));

  const all = getAllFilters(entity, args);
  mapToSql(nodesBuilder, entity, all);

  if (relations && relations.length) {
    relations.forEach((relation) => {
      countBuilder.leftJoinAndSelect(`${entity}.${relation}`, relation);
      nodesBuilder.leftJoinAndSelect(`${entity}.${relation}`, relation);
    });
  }

  if (args?.sort) {
    const [key, value] = firstKeyValue<SortOrderNested>(args.sort);
    if (isFinalSortOrder(value)) {
      nodesBuilder.orderBy(`${entity}.${key}`, value);
    } else {
      const [nestedKey, nestedValue] = firstKeyValue<SortOrder>(value);
      nodesBuilder.orderBy(`${key}.${nestedKey}`, nestedValue);
    }
  }

  if (args?.limit) {
    // select one extra row for checking whenever result has next page or not
    nodesBuilder.take(args?.limit + 1);
  }

  const count = await countBuilder.getCount();
  const nodes = await nodesBuilder.getMany();

  let hasNextPage = false;
  // remove that extra result
  if (args?.limit && nodes.length > args.limit) {
    nodes.pop();
    hasNextPage = true;
  }

  return {
    count,
    nodes: sanitize(nodes),
    cursor: hasNextPage ? encodeCursor(tail(nodes), args?.sort) : undefined,
  };
};

export default metafilters;
