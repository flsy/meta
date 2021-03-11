import { Connection } from "typeorm";
import { getConnection } from "../testHelpers";
import { PersonEntity, TrainEntity } from "../testEntities";
import metafilters from "../index";
import { encodeCursor } from "../paginate/paginate";

describe("test", () => {
  let connection: Connection;
  beforeEach(async () => {
    connection = await getConnection();
  });

  afterEach(async () => {
    await connection.close();
  });

  it("filters on related entity", async () => {
    const person1 = new PersonEntity();
    person1.firstName = "Molly";
    person1.lastName = "Homesoon";
    await connection.manager.save(person1);

    const person2 = new PersonEntity();
    person2.firstName = "Oscar";
    person2.lastName = "Nommanee";
    await connection.manager.save(person2);

    const t1 = new TrainEntity();
    t1.number = 5;
    t1.persons = Promise.resolve([person1, person2]);
    await connection.manager.save(t1);

    const t2 = new TrainEntity();
    t2.number = 6;
    t2.persons = Promise.resolve([person1, person2]);
    await connection.manager.save(t2);

    const t3 = new TrainEntity();
    t3.number = 7;
    t3.persons = Promise.resolve([person1, person2]);
    await connection.manager.save(t3);

    const repo = connection.getRepository(TrainEntity);

    const r1 = await metafilters<TrainEntity>(
      repo,
      {
        limit: 1,
        filters: { persons: { id: { type: "number", filters: [{ value: 1 }] } } },
      },
      ["persons"]
    );

    expect(r1.cursor).toEqual(encodeCursor({ id: 1 }));
    expect(r1.count).toEqual(3);
    expect(r1.nodes).toMatchObject([
      {
        id: 1,
        number: t1.number,
      },
    ]);

    const r2 = await metafilters<TrainEntity>(
      repo,
      {
        limit: 1,
        filters: { persons: { id: { type: "number", filters: [{ value: 1 }] } } },
        cursor: r1.cursor,
      },
      ["persons"]
    );
    expect(r2.cursor).toEqual(encodeCursor({ id: 2 }));
    expect(r2.count).toEqual(3);
    expect(r2.nodes).toMatchObject([
      {
        id: 2,
        number: t2.number,
      },
    ]);

    const r3 = await metafilters<TrainEntity>(
      repo,
      {
        limit: 1,
        filters: { persons: { id: { type: "number", filters: [{ value: 1 }] } } },
        cursor: r2.cursor,
      },
      ["persons"]
    );
    expect(r3.cursor).toEqual(undefined);
    expect(r3.count).toEqual(3);
    expect(r3.nodes).toMatchObject([
      {
        id: 3,
        number: t3.number,
      },
    ]);
  });
});
