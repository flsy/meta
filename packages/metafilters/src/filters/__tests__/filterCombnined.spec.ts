import { Connection } from 'typeorm';
import { PersonEntity } from '../../testEntities';
import metafilters from '../../index';
import { createPersons, getConnection } from '../../testHelpers';
import { Filter } from '../../interfaces';

describe('combined filters', () => {
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

  it('return no results when filters are too strict', async () => {
    const result = await query({
      firstName: { type: 'string', filters: [{ value: 'Oscar' }] },
      age: { type: 'number', filters: [{ value: 32, operator: 'GT' }] },
    });
    expect(result.count).toEqual(0);
  });

  it('return one result', async () => {
    const result = await query({
      firstName: { type: 'string', filters: [{ value: 'o' }] },
      age: { type: 'number', filters: [{ value: 32 }] },
    });
    expect(result.count).toEqual(1);
    expect(result.nodes[0].firstName).toEqual('Oscar');
  });
});
