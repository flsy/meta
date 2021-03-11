import { Connection } from "typeorm";
import { TrainEntity } from "../../testEntities";
import metafilters, { Sort } from "../../index";
import { getConnection } from "../../testHelpers";
import { Filter } from "../../interfaces";

describe("filter number", () => {
  let connection: Connection;
  beforeEach(async () => {
    connection = await getConnection();
  });

  afterEach(async () => {
    await connection.close();
  });

  const query = async (filters: Filter<TrainEntity>, sort: Sort<TrainEntity>) => {
    const repository = connection.getRepository(TrainEntity);

    const t1 = new TrainEntity();
    t1.number = 5;
    const t2 = new TrainEntity();
    t2.number = 6;
    const t3 = new TrainEntity();
    t3.number = 7;
    const t4 = new TrainEntity();
    t4.number = 8;

    await repository.save([t1, t2, t3, t4]);

    return metafilters(repository, { filters, sort });
  };

  it("filter on number range", async () => {
    const result = await query(
      {
        number: {
          type: "number",
          filters: [
            { operator: "GE", value: 5 },
            { operator: "LT", value: 8 },
          ],
        },
      },
      { number: "DESC" }
    );
    expect(result.count).toEqual(3);
    expect(result.nodes[0].number).toEqual(7);
    expect(result.nodes[1].number).toEqual(6);
    expect(result.nodes[2].number).toEqual(5);
  });
});
