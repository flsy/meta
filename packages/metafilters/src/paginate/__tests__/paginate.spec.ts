import 'reflect-metadata';
import { Connection } from 'typeorm';
import { createPersons, getConnection } from '../../testHelpers';
import { PersonEntity } from '../../testEntities';
import metafilters from '../../index';
import { encodeCursor } from '../paginate';

describe('paginate', () => {
  let connection: Connection;
  beforeEach(async () => {
    connection = await getConnection();
  });

  afterEach(async () => {
    await connection.close();
  });

  const query = async (limit?: number, cursor?: string) => {
    const repository = connection.getRepository(PersonEntity);
    await createPersons(repository, [
      { firstName: 'Molly', lastName: 'Homesoon' },
      { firstName: 'Greg', lastName: 'Arias' },
      { firstName: 'Lynne', lastName: 'Gwistic' },
      { firstName: 'Oscar', lastName: 'Nommanee' },
      { firstName: 'Greg', lastName: 'Arias' },
    ]);
    return metafilters(repository, { limit, cursor });
  };

  it('return all records when no filter or sort specified', async () => {
    const response = await query();

    expect(response.count).toEqual(5);
    expect(response.nodes.length).toEqual(5);
    expect(response.cursor).toEqual(undefined);
  });

  it('limits returned records to 2', async () => {
    const repository = connection.getRepository(PersonEntity);

    const page1 = await query(2);

    expect(page1.count).toEqual(5);
    expect(page1.nodes.length).toEqual(2);
    expect(page1.nodes.map(({ firstName }) => firstName)).toEqual(['Molly', 'Greg']);
    const cursor1 = encodeCursor(page1.nodes[1]);
    expect(page1.cursor).toEqual(cursor1);

    const page2 = await metafilters(repository, {
      limit: 2,
      cursor: cursor1,
    });
    expect(page2.count).toEqual(5);
    expect(page2.nodes.length).toEqual(2);
    expect(page2.nodes.map(({ firstName }) => firstName)).toEqual(['Lynne', 'Oscar']);
    const cursor2 = encodeCursor(page2.nodes[1]);
    expect(page2.cursor).toEqual(cursor2);

    const page3 = await metafilters(repository, {
      limit: 2,
      cursor: cursor2,
    });
    expect(page3.count).toEqual(5);
    expect(page3.nodes.length).toEqual(1);
    expect(page3.nodes.map(({ firstName }) => firstName)).toEqual(['Greg']);
    expect(page3.cursor).toEqual(undefined);
  });
});
