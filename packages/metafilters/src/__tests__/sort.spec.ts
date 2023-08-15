import metafilters from '../index';
import { close, get } from '../testHelpers/sqliteUtils';
import { seed, exampleColumn, seededData } from '../testHelpers/testData';

describe('sort', () => {
  it('return records sorted by string DESC', async () => {
    const db = await seed();
    const response = await metafilters( 'person-dash', exampleColumn, { sort: { firstName: 'DESC' } });

    const count = await get(db, response.count);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash";',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" ORDER BY "firstName" DESC;',
    });

    expect(count).toEqual({ count: seededData.length });
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

    expect(count).toEqual({ count: seededData.length });
  });
});
