import metafilters from '../../index';
import { all, close, get } from '../../testHelpers/sqliteUtils';
import { seed, exampleColumn, seededData } from '../../testHelpers/testData';

describe('strings filter', () => {
  it('should return all when empty filter', async () => {
    const db = await seed();
    const response = await metafilters('person-dash', exampleColumn, {
      filters: {
        firstName: {
          type: 'strings',
          filters: [],
        },
      },
    });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toEqual({
      count: 'SELECT COUNT(*) as count FROM "person-dash";',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash";',
    });

    expect(count).toEqual({ count: seededData.length });
    expect(nodes.length).toEqual(seededData.length);
  });

  it('should filter', async () => {
    const db = await seed();
    const response = await metafilters('person-dash', exampleColumn, {
      filters: {
        firstName: {
          type: 'strings',
          filters: [
            { value: 'Beta', operator: 'EQ' },
            { value: 'Joe', operator: 'EQ' },
          ],
        },
      },
    });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toEqual({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE "firstName" = \'Beta\' OR "firstName" = \'Joe\';',
      nodes:
          'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE "firstName" = \'Beta\' OR "firstName" = \'Joe\';',
    });
    expect(count).toEqual({ count: 2 });
    expect(nodes).toMatchObject([{ firstName: 'Joe' }, { firstName: 'Beta' }]);
  });

  it('should filter with operators', async () => {
    const db = await seed();
    const response = await metafilters('person-dash', exampleColumn, {
      filters: {
        firstName: {
          type: 'strings',
          filters: [{ value: 'e' }, { value: 'a' }],
        },
      },
    });

    expect(response).toEqual({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE coalesce("firstName", \'\') like \'%e%\' OR coalesce("firstName", \'\') like \'%a%\';',
      nodes:
          'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE coalesce("firstName", \'\') like \'%e%\' OR coalesce("firstName", \'\') like \'%a%\';',
    });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(count).toEqual({ count: 4 });
    expect(nodes.length).toEqual(4);
  });

  it('should filter with functions', async () => {
    const db = await seed();
    const response = await metafilters('person-dash', exampleColumn, {
      filters: {
        firstName: {
          type: 'strings',
          filters: [
            { value: 'joe', operator: 'EQ', customFunction: 'lower' },
            { value: 'Beta', operator: 'EQ' },
          ],
        },
      },
    });

    expect(response).toEqual({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE lower("firstName") = \'joe\' OR "firstName" = \'Beta\';',
      nodes:
          'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE lower("firstName") = \'joe\' OR "firstName" = \'Beta\';',
    });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(count).toEqual({ count: 2 });
    expect(nodes).toMatchObject([{ firstName: 'Joe' }, { firstName: 'Beta' }]);
  });
  it('filter by string EQ', async () => {
    const db = await seed();
    const response = await metafilters('person-dash', exampleColumn, {
      filters: { firstName: { type: 'string', filters: [{ value: 'Beta', operator: 'EQ' }] } },
    });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE "firstName" = \'Beta\';',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE "firstName" = \'Beta\';',
    });

    expect(count).toEqual({ count: 1 });
    expect(nodes.length).toEqual(1);
    expect(nodes).toMatchObject([{ firstName: 'Beta', lastName: 'Woods' }]);
  });

  it('filter by string EQ with alias', async () => {
    const db = await seed();
    const response = await metafilters('person-dash', [['firstName', 'name']], {
      filters: { firstName: { type: 'string', filters: [{ value: 'Beta', operator: 'EQ' }] } },
    });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE "firstName" = \'Beta\';',
      nodes: 'SELECT "firstName" as "name" FROM "person-dash" WHERE "firstName" = \'Beta\';',
    });

    expect(count).toEqual({ count: 1 });
    expect(nodes.length).toEqual(1);
    expect(nodes).toMatchObject([{ name: 'Beta' }]);
  });

  it('filter string by GE and LE operators', async () => {
    const db = await seed();
    const filters = metafilters( 'person-dash', exampleColumn, {
      filters: {
        firstName: {
          type: 'string',
          filters: [
            { value: 'B', operator: 'GE' },
            { value: 'C', operator: 'LE' },
          ],
        },
      },
    });

    expect(filters).toEqual({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE "firstName" >= \'B\' AND "firstName" <= \'C\';',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE "firstName" >= \'B\' AND "firstName" <= \'C\';',
    });

    const count = await get(db, filters.count);
    const nodes = await all(db, filters.nodes);
    await db.close();

    expect(count).toEqual({ count: 1 });
    expect(nodes).toEqual([
      {
        age: 30,
        firstName: 'Beta',
        id: 3,
        isValid: 1,
        lastName: 'Woods',
      },
    ]);
  });

  it('filter string by NE operator', async () => {
    const db = await seed();
    const filters = metafilters('person-dash', exampleColumn, {
      filters: { lastName: { type: 'string', filters: [{ operator: 'NE', value: 'Forest' }] } },
    });

    expect(filters).toEqual({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE "lastName" != \'Forest\';',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE "lastName" != \'Forest\';',
    });

    const count = await get(db, filters.count);
    const nodes = await all(db, filters.nodes);
    await db.close();

    expect(count).toEqual({ count: 5 });
    expect(nodes.map(n => (n as any).lastName)).toMatchObject(['Tree', 'Woods', 'RainForest', 'FirstNameEmptyStr', 'FirstNameNull']);
  });

  it('filter by string default LIKE', async () => {
    const db = await seed();
    const response = await metafilters('person-dash', exampleColumn, {
      filters: { firstName: { type: 'string', filters: [{ value: 'a' }] } },
    });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE coalesce("firstName", \'\') like \'%a%\';',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE coalesce("firstName", \'\') like \'%a%\';',
    });

    expect(count).toEqual({ count: 3 });
    expect(nodes.length).toEqual(3);
    expect(nodes).toMatchObject([{ firstName: 'Alpha' }, { firstName: 'Beta' }, { firstName: 'Carol' }]);
  });

  it('filter by string with null value (which means: give me everything)', async () => {
    const db = await seed();
    const response = await metafilters('person-dash', exampleColumn, {
      filters: { firstName: { type: 'string', filters: [{ value: null }] } },
    });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE coalesce("firstName", \'\') like \'%%\';',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE coalesce("firstName", \'\') like \'%%\';',
    });

    expect(count).toEqual({ count: seededData.length });
    expect(nodes.length).toEqual(seededData.length);
  });

  it('handles undefined filters', async () => {
    const db = await seed();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = await metafilters('person-dash', exampleColumn, { filters: { name: { type: 'string', filters: undefined } } });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash";',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash";',
    });

    expect(count).toEqual({ count: seededData.length });
    expect(nodes.length).toEqual(seededData.length);
  });

  it('filter by string with user defined function', async () => {
    const db = await seed();
    const response = await metafilters('person-dash', exampleColumn, {
      filters: { firstName: { type: 'string', filters: [{ value: 'beta', operator: 'EQ', customFunction: 'lower' }] } },
    });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE lower("firstName") = \'beta\';',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE lower("firstName") = \'beta\';',
    });

    expect(count).toEqual({ count: 1 });
    expect(nodes.length).toEqual(1);
    expect(nodes).toMatchObject([{ firstName: 'Beta' }]);
  });

  
  it('filter by EMPTY operator', async () => {
    const db = await seed();
    const response = await metafilters('person-dash', exampleColumn, {
      filters: { firstName: { type: 'string', filters: [{operator: 'EMPTY', value: null}] } },
    });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE "firstName" is null;', 
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE "firstName" is null;'}
    );

    expect(count).toEqual({ count: 1 });
    expect(nodes.length).toEqual(1);
    expect(nodes).toMatchObject([{ firstName: null }]);
  });

  it('filter by NONEMPTY operator', async () => {
    const db = await seed();
    const response = await metafilters('person-dash', exampleColumn, {
      filters: { firstName: { type: 'string', filters: [{operator: 'NONEMPTY', value: null}] } },
    });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE "firstName" is not null;', 
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE "firstName" is not null;'}
    );

    expect(count).toEqual({ count: 5 });
    expect(nodes.length).toEqual(5);
  });

});