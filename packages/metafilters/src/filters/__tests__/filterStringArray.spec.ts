import { Connection } from "typeorm";
import { CoachEntity, TrainEntity } from "../../testEntities";
import metafilters from "../../index";
import { getConnection } from "../../testHelpers";
import { Filter } from "../../interfaces";

describe("filter text array", () => {
  let connection: Connection;
  beforeEach(async () => {
    connection = await getConnection();
  });

  afterEach(async () => {
    await connection.close();
  });

  const query = async (filters?: Filter<TrainEntity>) => {
    const coach1 = new CoachEntity();
    coach1.color = "red";
    await connection.manager.save(coach1);

    const coach2 = new CoachEntity();
    await connection.manager.save(coach2);

    const coach3 = new CoachEntity();
    coach3.color = "red";
    await connection.manager.save(coach3);

    const coach4 = new CoachEntity();
    coach4.color = "blue";
    await connection.manager.save(coach4);

    const t1 = new TrainEntity();
    t1.number = 1;
    t1.coaches = Promise.resolve([coach1, coach2]);

    const t2 = new TrainEntity();
    t2.number = 2;
    t2.coaches = Promise.resolve([coach3]);

    const t3 = new TrainEntity();
    t3.number = 3;
    t3.coaches = Promise.resolve([coach4]);

    await connection.manager.save([t1, t2, t3]);

    const trainRepository = connection.getRepository(TrainEntity);

    return metafilters(trainRepository, { filters }, ["coaches"]);
  };

  it("return all records when no filter specified", async () => {
    const result = await query();
    expect(result.count).toEqual(3);
  });

  it("filter with a null value", async () => {
    const result = await query({
      coaches: { color: { type: "strings", filters: [{ value: null }] } },
    });
    expect(result.count).toEqual(1); // not sure this is right
    expect(result.nodes).toMatchObject([
      {
        number: 1,
        coaches: [{ id: 2, color: null }],
      },
    ]);
  });

  it("filter only trains with red coaches", async () => {
    const result = await query({
      coaches: { color: { type: "strings", filters: [{ value: ["red"] }] } },
    });
    expect(result.count).toEqual(2);
    expect(result.nodes).toMatchObject([
      { number: 1, coaches: [{ id: 1 }] },
      { number: 2, coaches: [{ id: 3 }] },
    ]);
  });

  it("filter only trains with blue coaches", async () => {
    const result = await query({
      coaches: { color: { type: "strings", filters: [{ value: ["blue"] }] } },
    });
    expect(result.count).toEqual(1);
    expect(result.nodes).toMatchObject([{ number: 3, coaches: [{ id: 4 }] }]);
  });

  it("filter trains with blue and red coaches", async () => {
    const result = await query({
      coaches: { color: { type: "strings", filters: [{ value: ["blue", "red"] }] } },
    });
    expect(result.count).toEqual(3);
    expect(result.nodes).toMatchObject([
      { number: 1, coaches: [{ id: 1 }] },
      { number: 2, coaches: [{ id: 3 }] },
      { number: 3, coaches: [{ id: 4 }] },
    ]);
  });

  it("filter only trains with coaches without color", async () => {
    const result = await query({
      coaches: { color: { type: "strings", filters: [{ value: [null] }] } },
    });
    expect(result.count).toEqual(0); // not sure this is right
    expect(result.nodes).toMatchObject([]);
  });
});
