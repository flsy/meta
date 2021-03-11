import 'reflect-metadata';
import { Connection } from 'typeorm';
import { PersonEntity } from '../testEntities';
import metafilters from '../index';
import { createPersons, getConnection } from '../testHelpers';
import { Filter, Sort } from '../interfaces';

describe('filter and sort', () => {
  let connection: Connection;
  beforeEach(async () => {
    connection = await getConnection();
  });

  afterEach(async () => {
    await connection.close();
  });

  const query = async (args?: { sort?: Sort<PersonEntity>; filters?: Filter<PersonEntity> }) => {
    const repository = connection.getRepository(PersonEntity);
    await createPersons(repository, [
      { firstName: 'Molly', lastName: 'Homesoon', isArchived: false, age: 50 },
      { firstName: 'Greg', lastName: 'Arias', isArchived: true, age: 40 },
      { firstName: 'Lynne', lastName: 'Gwistic', age: 30 },
      { firstName: 'Oscar', lastName: 'Nommanee', age: 40 },
    ]);
    return metafilters(repository, args);
  };

  it('return all records when no filter or sort specified', async () => {
    const response = await query();

    expect(response.count).toEqual(4);
  });

  it('return two record', async () => {
    const response = await query({
      filters: {
        age: { type: 'number', filters: [{ value: 40, operator: 'GE' }] },
      },
      sort: { age: 'DESC' },
    });

    expect(response.count).toEqual(3);
    expect(response.nodes.map(({ firstName, age }) => ({ firstName, age }))).toEqual([
      { firstName: 'Molly', age: 50 },
      { firstName: 'Greg', age: 40 },
      { firstName: 'Oscar', age: 40 },
    ]);
  });
});
