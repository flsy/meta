import metafilters from '../index';
import { all, close, get } from '../sqliteUtils';
import { exampleColumn, seed } from '../testData';

describe('sort', () => {
  it('return records sorted by string DESC', async () => {
    const db = await seed();
    const response = await metafilters( 'person-dash', exampleColumn, { sort: { firstName: 'DESC' } });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash";',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" ORDER BY "firstName" DESC;',
    });

    expect(count).toEqual({ count: 4 });
    expect(nodes).toMatchObject([{ firstName: 'Joe' }, { firstName: 'Carol' }, { firstName: 'Beta' }, { firstName: 'Alpha' }]);
  });
  it('handles undefined sort', async () => {
    const db = await seed();
    const response = await metafilters( 'person-dash', exampleColumn, { sort: { id: undefined, lastName: undefined } });

    const count = await get(db, response.count);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash";',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash";',
    });

    expect(count).toEqual({ count: 4 });
  });
});
