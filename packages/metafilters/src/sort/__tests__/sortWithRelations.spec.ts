import 'reflect-metadata';
import { Connection } from 'typeorm';
import { PersonEntity, TrainEntity } from '../../testEntities';
import metafilters from '../../index';
import { getConnection } from '../../testHelpers';

describe('sort on related entity', () => {
  let connection: Connection;
  beforeEach(async () => {
    connection = await getConnection();
  });

  afterEach(async () => {
    await connection.close();
  });

  it('sorts on related entity', async () => {
    const person1 = new PersonEntity();
    person1.firstName = 'Molly';
    person1.lastName = 'Homesoon';
    person1.age = 30;
    await connection.manager.save(person1);

    const person2 = new PersonEntity();
    person2.firstName = 'Oscar';
    person2.lastName = 'Nommanee';
    person2.age = 35;
    await connection.manager.save(person2);

    const person3 = new PersonEntity();
    person3.firstName = 'Greg';
    person3.lastName = 'Arias';
    person3.age = 40;
    await connection.manager.save(person3);

    const train = new TrainEntity();
    train.number = 5;
    train.persons = Promise.resolve([person1, person2, person3]);
    await connection.manager.save(train);

    const trainRepository = connection.getRepository(TrainEntity);

    const result = await metafilters<TrainEntity>(
      trainRepository,
      {
        filters: { persons: { firstName: { type: 'string', filters: [{ operator: 'LIKE', value: 'o' }] } } },
        sort: { persons: { age: 'DESC' } },
      },
      ['persons'],
    );

    expect(result.count).toEqual(1);
    expect(result.nodes).toEqual([
      {
        id: 1,
        number: 5,
        persons: [
          {
            age: 35,
            firstName: 'Oscar',
            id: 2,
            isArchived: null,
            lastName: 'Nommanee',
          },
          {
            firstName: 'Molly',
            id: 1,
            isArchived: null,
            lastName: 'Homesoon',
            age: 30,
          },
        ],
      },
    ]);
  });
});
