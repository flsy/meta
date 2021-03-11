import "reflect-metadata";
import { Connection } from "typeorm";
import { PersonEntity } from "../../testEntities";
import metafilters from "../../index";
import { createPersons, getConnection } from "../../testHelpers";
import { Filter } from "../../interfaces";

describe("filter boolean", () => {
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
      { firstName: "Molly", lastName: "Homesoon", isArchived: false },
      { firstName: "Greg", lastName: "Arias", isArchived: true },
      { firstName: "Lynne", lastName: "Gwistic" },
    ]);
    return metafilters(repository, { filters });
  };

  it("return all records when no filter specified", async () => {
    const response = await query();

    expect(response.count).toEqual(3);
  });

  it("return one record when filter is set to null", async () => {
    const response = await query({
      isArchived: { type: "boolean", value: null },
    });

    expect(response.count).toEqual(1);
    expect(response.nodes[0].firstName).toEqual("Lynne");
  });

  it("return only Molly who is not archived", async () => {
    const response = await query({
      isArchived: { type: "boolean", value: false },
    });

    expect(response.count).toEqual(1);
    expect(response.nodes[0].firstName).toEqual("Molly");
  });

  it("return only Greg who is archived", async () => {
    const response = await query({
      isArchived: { type: "boolean", value: true },
    });

    expect(response.count).toEqual(1);
    expect(response.nodes[0].firstName).toEqual("Greg");
  });
});
