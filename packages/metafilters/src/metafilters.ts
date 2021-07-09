import { Columns, IMetaFiltersArgs } from '@falsy/metacore';
import { getSortKey } from './sort';
import { whereFilters } from './filters';
import { escape } from './tools';

export const metafilters = <T>(columns: Columns<T>, tableName: string, args?: IMetaFiltersArgs) => {
  const sortKey = getSortKey(args?.sort);
  const names = Object.keys(columns).map(escape);

  const chunks = [`SELECT ${names.join(', ')}`, `FROM ${escape(tableName)}`];
  const countChunks = [`SELECT COUNT(*) as count`, `FROM ${escape(tableName)}`];
  let wheres: string[] = [];

  if (args && args.filters) {
    wheres = [...wheres, ...whereFilters(args.filters)];
  }

  if (wheres.length) {
    const whereSQL = `WHERE ${wheres.join(' AND ')}`;
    chunks.push(whereSQL);
    countChunks.push(whereSQL);
  }

  if (args && args.sort && sortKey) {
    chunks.push(`ORDER BY ${escape(sortKey)} ${args.sort[sortKey]}`);
  }

  if (args && args.limit) {
    chunks.push(`LIMIT ${args.limit}`);

    if (args.page && args.page > 0) {
      chunks.push(`OFFSET ${args.limit * args.page}`);
    }
  }

  return {
    count: `${countChunks.join(' ')};`,
    nodes: `${chunks.join(' ')};`,
  };
};
