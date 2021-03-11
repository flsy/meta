import "reflect-metadata";
import { Connection } from "typeorm";
import { createPersons, getConnection } from "../../testHelpers";
import { PersonEntity } from "../../testEntities";
import metafilters from "../../index";

describe("filter and sort", () => {
  let connection: Connection;
  beforeEach(async () => {
    connection = await getConnection();
  });

  afterEach(async () => {
    await connection.close();
  });

  const query = async (limit?: number) => {
    const repository = connection.getRepository(PersonEntity);
    await createPersons(repository, [
      { firstName: "Molly", lastName: "Homesoon", isArchived: false, age: 50 },
      { firstName: "Greg", lastName: "Arias", isArchived: true, age: 40 },
      { firstName: "Lynne", lastName: "Gwistic", age: 30 },
      { firstName: "Oscar", lastName: "Nommanee", age: 40 },
    ]);
    return metafilters(repository, { limit });
  };

  it("return all records when no filter or sort specified", async () => {
    const response = await query();

    expect(response.count).toEqual(4);
  });

  it("return all records when limit is larger than record count", async () => {
    const response = await query(8);

    expect(response.count).toEqual(4);
    expect(response.nodes.length).toEqual(4);
  });

  it("limits returned records to 2", async () => {
    const response = await query(2);

    expect(response.count).toEqual(4);
    expect(response.nodes.length).toEqual(2);
  });
});
