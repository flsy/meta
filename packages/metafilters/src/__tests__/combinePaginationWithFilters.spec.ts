import 'reflect-metadata';
import { Connection } from 'typeorm';
import { PersonEntity } from '../testEntities';
import metafilters from '../index';
import { createPersons, getConnection } from '../testHelpers';
import { IPaginatorArguments } from '../interfaces';
import { encodeCursor } from '../paginate/paginate';

describe('paginate and filter and sort', () => {
  let connection: Connection;
  beforeEach(async () => {
    connection = await getConnection();
  });

  afterEach(async () => {
    await connection.close();
  });

  const query = async (args?: IPaginatorArguments<PersonEntity>) => {
    const repository = connection.getRepository(PersonEntity);
    await createPersons(repository, [
      { firstName: 'Molly', lastName: 'Homesoon', isArchived: false, age: 50 },
      { firstName: 'Greg', lastName: 'Arias', isArchived: true, age: 40 },
      { firstName: 'Lynne', lastName: 'Gwistic', isArchived: true, age: 30 },
      { firstName: 'Oscar', lastName: 'Nommanee', age: 55 },
      { firstName: 'Stan', lastName: 'Dupp', isArchived: true, age: 24 },
      { firstName: 'Sly', lastName: 'Meebuggah', age: 38 },
      { firstName: 'Dee', lastName: 'End', age: 90 },
    ]);
    return metafilters(repository, args);
  };

  it('return two record', async () => {
    const repository = connection.getRepository(PersonEntity);

    const filters: IPaginatorArguments<PersonEntity> = {
      filters: {
        age: { type: 'number', filters: [{ value: 30, operator: 'GE' }] },
      },
      sort: { age: 'DESC' },
      limit: 4,
    };

    const page1 = await query(filters);

    expect(page1.count).toEqual(6);
    expect(page1.nodes.length).toEqual(4);
    expect(page1.nodes.map(({ firstName, age }) => ({ firstName, age }))).toEqual([
      { firstName: 'Dee', age: 90 },
      { firstName: 'Oscar', age: 55 },
      { firstName: 'Molly', age: 50 },
      { firstName: 'Greg', age: 40 },
    ]);

    const cursor1 = encodeCursor(page1.nodes[3], filters.sort);
    expect(page1.cursor).toEqual(cursor1);

    const page2 = await metafilters(repository, {
      ...filters,
      cursor: cursor1,
    });
    expect(page2.count).toEqual(6);

    expect(page2.nodes.length).toEqual(2);
    expect(page2.cursor).toEqual(undefined);
    expect(page2.nodes.map(({ firstName, age }) => ({ firstName, age }))).toEqual([
      { firstName: 'Sly', age: 38 },
      { firstName: 'Lynne', age: 30 },
    ]);
  });
});
