import metafilters from '../index';
import { all, close } from '../testHelpers/sqliteUtils';
import { exampleColumn, seed } from '../testData';

describe('common code', () => {
  it('map records to table column names', async () => {
    const db = await seed();
    const response = await metafilters('person-dash', exampleColumn);

    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash";',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash";',
    });

    expect(nodes).toEqual([
      { id: 1, firstName: 'Joe', lastName: 'Forest', age: 52, isValid: 0 },
      { id: 2, firstName: 'Alpha', lastName: 'Tree', age: 2, isValid: 1 },
      { id: 3, firstName: 'Beta', lastName: 'Woods', age: 30, isValid: 1 },
      { id: 5, firstName: 'Carol', lastName: 'RainForest', age: 18, isValid: 1 },
      { id: 6, firstName: '', lastName: 'FirstNameEmptyStr', age: 18, isValid: 1 },
      { id: 7, firstName: null, lastName: 'FirstNameNull', age: 18, isValid: 1 },

    ]);
  });
  it('map use all columns if not provided', async () => {
    const db = await seed();
    const response = await metafilters('person-dash');

    await all(db, response.nodes);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash";',
      nodes: 'SELECT * FROM "person-dash";',
    });
  });
});
