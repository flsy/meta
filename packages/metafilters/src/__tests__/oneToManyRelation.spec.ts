import { Connection } from "typeorm";
import { getConnection } from "../testHelpers";
import { PersonEntity, TrainEntity } from "../testEntities";
import metafilters from "../index";

describe("oneToManyRelation", () => {
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

    const person3 = new PersonEntity();
    person3.firstName = "Greg";
    person3.lastName = "Arias";
    await connection.manager.save(person3);

    const train = new TrainEntity();
    train.number = 5;
    train.persons = Promise.resolve([person1, person2, person3]);
    await connection.manager.save(train);

    const trainRepository = connection.getRepository(TrainEntity);

    // const result = await toPaginatedResponse(trainRepository, {}, ["persons"]);
    // expect(result.count).toEqual(1);
    // expect(result.nodes).toEqual([{ id: 1 }]);

    const result = await metafilters<TrainEntity>(
      trainRepository,
      {
        filters: { persons: { firstName: { type: "string", filters: [{ operator: "LIKE", value: "o" }] } } },
      },
      ["persons"]
    );

    expect(result.count).toEqual(1);
    expect(result.nodes).toEqual([
      {
        id: 1,
        number: 5,
        persons: [
          {
            age: null,
            firstName: "Molly",
            id: 1,
            isArchived: null,
            lastName: "Homesoon",
          },
          {
            age: null,
            firstName: "Oscar",
            id: 2,
            isArchived: null,
            lastName: "Nommanee",
          },
        ],
      },
    ]);
  });

  it("creates 3 trains and 3 peoples and returns only 2 trains", async () => {
    const person1 = new PersonEntity();
    person1.firstName = "Molly";
    person1.lastName = "Homesoon";

    const person2 = new PersonEntity();
    person2.firstName = "Oscar";
    person2.lastName = "Nommanee";

    const person3 = new PersonEntity();
    person3.firstName = "Greg";
    person3.lastName = "Arias";

    await connection.manager.save([person1, person2, person3]);

    const t1 = new TrainEntity();
    t1.number = 100;
    t1.persons = Promise.resolve([person1, person2, person3]);

    const t2 = new TrainEntity();
    t2.number = 200;
    t2.persons = Promise.resolve([person2]);

    const t3 = new TrainEntity();
    t3.number = 300;

    await connection.manager.save([t1, t2, t3]);

    const trainRepository = connection.getRepository(TrainEntity);

    const result1 = await metafilters<TrainEntity>(trainRepository, { limit: 2 }, ["persons"]);

    expect(result1.nodes).toEqual([
      {
        id: 1,
        number: 100,
        persons: [
          {
            age: null,
            firstName: "Molly",
            id: 1,
            isArchived: null,
            lastName: "Homesoon",
          },
          {
            age: null,
            firstName: "Oscar",
            id: 2,
            isArchived: null,
            lastName: "Nommanee",
          },
          {
            age: null,
            firstName: "Greg",
            id: 3,
            isArchived: null,
            lastName: "Arias",
          },
        ],
      },
      {
        id: 2,
        number: 200,
        persons: [
          {
            age: null,
            firstName: "Oscar",
            id: 2,
            isArchived: null,
            lastName: "Nommanee",
          },
        ],
      },
    ]);
    expect(result1.count).toEqual(3);
    expect(result1.cursor).toEqual("%7B%22id%22:2%7D");

    const result2 = await metafilters<TrainEntity>(trainRepository, { limit: 2, cursor: result1.cursor }, ["persons"]);

    expect(result2.count).toEqual(3);
    expect(result2.cursor).toEqual(undefined);
    expect(result2.nodes).toEqual([
      {
        id: 3,
        number: 300,
        persons: [],
      },
    ]);
  });
});
