import metafilters from '../../index';
import { all, get } from '../../testHelpers/sqliteUtils';
import { seed, exampleColumn } from '../../testHelpers/testData';

describe('number filter', () => {
  it('filter number by like operator', async () => {
    const db = await seed();
    const response = metafilters('person-dash', exampleColumn, {
      filters: {
        age: {
          type: 'number',
          filters: [{ value: 2, operator: 'LIKE' }],
        },
      },
    });

    expect(response).toEqual({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE "age" like \'%2%\';',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE "age" like \'%2%\';',
    });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await db.close();

    expect(count).toEqual({ count: 2 });
    expect(nodes).toMatchObject([{ age: 52 }, { age: 2 }]);
  });
});