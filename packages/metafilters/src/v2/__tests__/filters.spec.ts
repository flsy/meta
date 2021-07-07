import { exampleColumn, seed } from '../testData';
import metafilters from '../index';
import { all, close, get } from '../sqliteUtils';

describe('filters', () => {
  describe('string filters', () => {
    it('filter by string EQ', async () => {
      const db = await seed();
      const response = await metafilters(exampleColumn, 'person-dash', {
        filters: { firstName: { type: 'string', filters: [{ value: 'Beta', operator: 'EQ' }] } },
      });

      const count = await get(db, response.count);
      const nodes = await all(db, response.nodes);
      await close(db);

      expect(response).toMatchObject({
        count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE "firstName" = "Beta";',
        nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE "firstName" = "Beta";',
      });

      expect(count).toEqual({ count: 1 });
      expect(nodes.length).toEqual(1);
      expect(nodes).toMatchObject([{ firstName: 'Beta', lastName: 'Woods' }]);
    });

    it('filter by string default LIKE', async () => {
      const db = await seed();
      const response = await metafilters(exampleColumn, 'person-dash', {
        filters: { firstName: { type: 'string', filters: [{ value: 'a' }] } },
      });

      const count = await get(db, response.count);
      const nodes = await all(db, response.nodes);
      await close(db);

      expect(response).toMatchObject({
        count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE "firstName" like "%a%";',
        nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE "firstName" like "%a%";',
      });

      expect(count).toEqual({ count: 3 });
      expect(nodes.length).toEqual(3);
      expect(nodes).toMatchObject([{ firstName: 'Alpha' }, { firstName: 'Beta' }, { firstName: 'Carol' }]);
    });

    it('filter by string with null value', async () => {
      const db = await seed();
      const response = await metafilters(exampleColumn, 'person-dash', {
        filters: { firstName: { type: 'string', filters: [{ value: null }] } },
      });

      const count = await get(db, response.count);
      const nodes = await all(db, response.nodes);
      await close(db);

      expect(response).toMatchObject({
        count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE "firstName" is null;',
        nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE "firstName" is null;',
      });

      expect(count).toEqual({ count: 0 });
      expect(nodes.length).toEqual(0);
      expect(nodes).toMatchObject([]);
    });

    it('handles undefined filters', async () => {
      const db = await seed();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const response = await metafilters(exampleColumn, 'person-dash', { filters: { name: { type: 'string', filters: undefined } } });

      const count = await get(db, response.count);
      const nodes = await all(db, response.nodes);
      await close(db);

      expect(response).toMatchObject({
        count: 'SELECT COUNT(*) as count FROM "person-dash";',
        nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash";',
      });

      expect(count).toEqual({ count: 4 });
      expect(nodes.length).toEqual(4);
    });

    it('filter by string with user defined function', async () => {
      const db = await seed();
      const response = await metafilters(exampleColumn, 'person-dash', {
        filters: { firstName: { type: 'string', filters: [{ value: 'beta', operator: 'EQ', customFunction: 'lower' }] } },
      });

      const count = await get(db, response.count);
      const nodes = await all(db, response.nodes);
      await close(db);

      expect(response).toMatchObject({
        count: 'SELECT COUNT(*) as count FROM "person-dash" WHERE lower("firstName") = "beta";',
        nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE lower("firstName") = "beta";',
      });

      expect(count).toEqual({ count: 1 });
      expect(nodes.length).toEqual(1);
      expect(nodes).toMatchObject([{ firstName: 'Beta' }]);
    });
  });

  describe('filters combined', () => {
    it('filter', async () => {
      const db = await seed();
      const response = await metafilters(exampleColumn, 'person-dash', {
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
        count:
          'SELECT COUNT(*) as count FROM "person-dash" WHERE "firstName" like "%a%" AND "firstName" like "%a%" AND "age" > 2 AND "age" <= 30 AND "isValid" = true;',
        nodes:
          'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash" WHERE "firstName" like "%a%" AND "firstName" like "%a%" AND "age" > 2 AND "age" <= 30 AND "isValid" = true ORDER BY "age" ASC LIMIT 7;',
      });

      expect(count).toEqual({ count: 2 });
      expect(nodes.length).toEqual(2);
      expect(nodes).toMatchObject([{ firstName: 'Carol' }, { firstName: 'Beta' }]);
    });
  });
});
