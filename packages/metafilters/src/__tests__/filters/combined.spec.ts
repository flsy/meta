import { exampleColumn, seed } from '../../testData';
import metafilters from '../../index';
import { all, close, get } from '../../sqliteUtils';


describe('filters combined', () => {
  it('filter', async () => {
    const db = await seed();
    const response = await metafilters( 'person-dash',exampleColumn, {
      filters: {
        firstName: { type: 'string', filters: [{ value: 'a' }, { value: 'a' }] },
        age: {
          type: 'number',
          filters: [
            { value: 2, operator: 'GT' },
            { value: 30, operator: 'LE' },
          ],
        },
        isValid: { type: 'boolean', value: true },
      },
      sort: {
        age: 'ASC',
      },
      limit: 7,
    });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE "firstName" like \'%a%\' AND "firstName" like \'%a%\' AND "age" > 2 AND "age" <= 30 AND "isValid" = true;',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE "firstName" like \'%a%\' AND "firstName" like \'%a%\' AND "age" > 2 AND "age" <= 30 AND "isValid" = true ORDER BY "age" ASC LIMIT 7;',
    });

    expect(count).toEqual({ count: 2 });
    expect(nodes.length).toEqual(2);
    expect(nodes).toMatchObject([{ firstName: 'Carol' }, { firstName: 'Beta' }]);
  });
});