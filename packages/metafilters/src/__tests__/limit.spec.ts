import metafilters from '../index';
import { all, close, get } from '../sqliteUtils';
import { exampleColumn, seed } from '../testData';

describe('limit', () => {
  it('return all records when no limit specified', async () => {
    const db = await seed();
    const response = await metafilters(exampleColumn, 'person-dash');

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(count).toEqual({ count: 4 });
    expect(nodes[0]).toEqual({ id: 1, firstName: 'Joe', lastName: 'Forest', age: 52, isValid: 0 });
    expect(nodes.length).toEqual(4);
  });

  it('return all records when limit is larger than record count', async () => {
    const db = await seed();
    const response = await metafilters(exampleColumn, 'person-dash', { limit: 8 });
    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);
    expect(count).toEqual({ count: 4 });
    expect(nodes.length).toEqual(4);
  });

  it('limits returned records to 2', async () => {
    const db = await seed();
    const response = await metafilters(exampleColumn, 'person-dash', { limit: 2 });

    const count = await get(db, response.count);
    const nodes = await all(db, response.nodes);
    await close(db);

    expect(count).toEqual({ count: 4 });
    expect(nodes.length).toEqual(2);
  });
});
