import { Connection } from 'typeorm';
import { PersonEntity } from '../../testEntities';
import metafilters from '../../index';
import { createPersons, getConnection } from '../../testHelpers';
import { Filter } from '../../interfaces';

describe('filter number', () => {
  let connection: Connection;
  beforeEach(async () => {
    connection = await getConnection();
  });

  afterEach(async () => {
    await connection.close();
  });

  const query = async (filters?: Filter<PersonEntity>) => {
    const repository = connection.getRepository(PersonEntity);
    await createPersons(repository, [
      { firstName: 'Molly', lastName: 'Homesoon', age: 35 },
      { firstName: 'Greg', lastName: 'Arias', age: 32 },
      { firstName: 'Oscar', lastName: 'Nommanee', age: 32 },
      { firstName: 'Lynne', lastName: 'Gwistic' },
    ]);

    return metafilters(repository, { filters });
  };

  it('return all records when no filter specified', async () => {
    const result = await query();
    expect(result.count).toEqual(4);
    expect(result.nodes[0].firstName).toEqual('Molly');
    expect(result.nodes[1].firstName).toEqual('Greg');
    expect(result.nodes[2].firstName).toEqual('Oscar');
    expect(result.nodes[3].firstName).toEqual('Lynne');
  });

  it('filter by a null value', async () => {
    const result = await query({
      age: { type: 'number', filters: [{ value: null }] },
    });
    expect(result.count).toEqual(1);
    expect(result.nodes[0].firstName).toEqual('Lynne');
  });

  it('filter by a specific number with no result', async () => {
    const result = await query({
      age: { type: 'number', filters: [{ value: 18 }] },
    });
    expect(result.count).toEqual(0);
  });

  it('filter by a specific number with one result', async () => {
    const result = await query({
      age: { type: 'number', filters: [{ value: 35 }] },
    });
    expect(result.count).toEqual(1);
    expect(result.nodes[0].firstName).toEqual('Molly');
  });

  it('filter by a specific number with two results', async () => {
    const result = await query({
      age: { type: 'number', filters: [{ value: 32 }] },
    });
    expect(result.count).toEqual(2);
    expect(result.nodes[0].firstName).toEqual('Greg');
    expect(result.nodes[1].firstName).toEqual('Oscar');
  });

  describe('operator NE - Not equal to', () => {
    it('filter by NE with no expected result', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 32, operator: 'NE' }] },
      });
      expect(result.count).toEqual(1); // 2
      expect(result.nodes[0].firstName).toEqual('Molly');
      // expect(result.nodes[1].firstName).toEqual('Lyne');
    });

    it('filter by NE with two expected results', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: null, operator: 'NE' }] },
      });
      expect(result.count).toEqual(3);
      expect(result.nodes[0].firstName).toEqual('Molly');
      expect(result.nodes[1].firstName).toEqual('Greg');
      expect(result.nodes[2].firstName).toEqual('Oscar');
    });

    it('filter by NE with three expected results', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 35, operator: 'NE' }] },
      });
      expect(result.count).toEqual(2); // 3
      expect(result.nodes[0].firstName).toEqual('Greg');
      expect(result.nodes[1].firstName).toEqual('Oscar');
      // expect(result.nodes[2].firstName).toEqual('Molly');
    });
  });

  describe('operator GT - greater than', () => {
    it('filter by GT with no expected result', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 40, operator: 'GT' }] },
      });
      expect(result.count).toEqual(0);
    });

    it('filter by GT with one expected result', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 32, operator: 'GT' }] },
      });
      expect(result.count).toEqual(1);
      expect(result.nodes[0].firstName).toEqual('Molly');
    });

    it('filter by GT with three expected results', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 10, operator: 'GT' }] },
      });
      expect(result.count).toEqual(3);
      expect(result.nodes[0].firstName).toEqual('Molly');
      expect(result.nodes[1].firstName).toEqual('Greg');
      expect(result.nodes[2].firstName).toEqual('Oscar');
    });
  });

  describe('operator LT - Less than', () => {
    it('filter by LT with no expected result', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 5, operator: 'LT' }] },
      });
      expect(result.count).toEqual(0);
    });

    it('filter by LT with two expected result', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 35, operator: 'LT' }] },
      });
      expect(result.count).toEqual(2);
      expect(result.nodes[0].firstName).toEqual('Greg');
      expect(result.nodes[1].firstName).toEqual('Oscar');
    });

    it('filter by LT with three expected results', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 50, operator: 'LT' }] },
      });
      expect(result.count).toEqual(3);
      expect(result.nodes[0].firstName).toEqual('Molly');
      expect(result.nodes[1].firstName).toEqual('Greg');
      expect(result.nodes[2].firstName).toEqual('Oscar');
    });
  });

  describe('operator GE - Greater than or equal to', () => {
    it('filter by GE with no expected result', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 50, operator: 'GE' }] },
      });
      expect(result.count).toEqual(0);
    });

    it('filter by GE with one expected result', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 35, operator: 'GE' }] },
      });
      expect(result.count).toEqual(1);
      expect(result.nodes[0].firstName).toEqual('Molly');
    });

    it('filter by GE with three expected results', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 32, operator: 'GE' }] },
      });
      expect(result.count).toEqual(3);
      expect(result.nodes[0].firstName).toEqual('Molly');
      expect(result.nodes[1].firstName).toEqual('Greg');
      expect(result.nodes[2].firstName).toEqual('Oscar');
    });
  });

  describe('operator LE - Less than or equal to', () => {
    it('filter by LE with no expected result', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 20, operator: 'LE' }] },
      });
      expect(result.count).toEqual(0);
    });

    it('filter by LE with two expected results', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 32, operator: 'LE' }] },
      });
      expect(result.count).toEqual(2);
      expect(result.nodes[0].firstName).toEqual('Greg');
      expect(result.nodes[1].firstName).toEqual('Oscar');
    });

    it('filter by GE with three expected results', async () => {
      const result = await query({
        age: { type: 'number', filters: [{ value: 35, operator: 'LE' }] },
      });
      expect(result.count).toEqual(3);
      expect(result.nodes[0].firstName).toEqual('Molly');
      expect(result.nodes[1].firstName).toEqual('Greg');
      expect(result.nodes[2].firstName).toEqual('Oscar');
    });
  });
  describe('number range', () => {
    it('filter all values > 20 AND <=35', async () => {
      const result = await query({
        age: {
          type: 'number',
          filters: [
            { operator: 'GT', value: 20 },
            { operator: 'LE', value: 35 },
          ],
        },
      });
      expect(result.count).toEqual(3);
      expect(result.nodes[0].firstName).toEqual('Molly');
      expect(result.nodes[1].firstName).toEqual('Greg');
      expect(result.nodes[2].firstName).toEqual('Oscar');
    });
  });
});
