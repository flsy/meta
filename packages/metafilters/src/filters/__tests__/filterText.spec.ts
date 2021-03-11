import { Connection } from "typeorm";
import { PersonEntity } from "../../testEntities";
import metafilters from "../../index";
import { createPersons, getConnection } from "../../testHelpers";
import { Filter } from "../../interfaces";

describe("filter text", () => {
  let connection: Connection;
  beforeEach(async () => {
    connection = await getConnection();
  });

  afterEach(async () => {
    await connection.close();
  });

  const query = async (filters?: Filter<PersonEntity>) => {
    const repository = connection.getRepository(PersonEntity);
    await createPersons(repository, [{ firstName: "Molly", lastName: "Homesoon" }, { firstName: "Greg", lastName: "Arias" }, { lastName: "Gwistic" }]);

    return metafilters(repository, { filters });
  };

  it("return all records when no filter specified", async () => {
    const result = await query();
    expect(result.count).toEqual(3);
  });

  it("filter by a null value", async () => {
    const result = await query({
      firstName: { type: "string", filters: [{ value: null }] },
    });
    expect(result.count).toEqual(1);
    expect(result.nodes[0].lastName).toEqual("Gwistic");
  });

  it("filter by a text", async () => {
    const result = await query({
      firstName: { type: "string", filters: [{ value: "molly" }] },
    });
    expect(result.count).toEqual(1);
    expect(result.nodes[0].firstName).toEqual("Molly");
  });

  it("filter by a fulltext", async () => {
    const result = await query({
      firstName: { type: "string", filters: [{ value: "ll" }] },
    });
    expect(result.count).toEqual(1);
    expect(result.nodes[0].firstName).toEqual("Molly");
  });

  describe("operator EQ", () => {
    it("filter by a specific text with no result", async () => {
      const result = await query({
        lastName: {
          type: "string",
          filters: [{ value: "ria", operator: "EQ" }],
        },
      });
      expect(result.count).toEqual(0);
    });

    it("filter by a specific text with one result", async () => {
      const result = await query({
        lastName: { type: "string", filters: [{ value: "ria" }] },
      });
      expect(result.count).toEqual(1);
      expect(result.nodes[0].firstName).toEqual("Greg");
    });
  });

  describe("operator LIKE", () => {
    it("filter by a specific text with no result", async () => {
      const result = await query({
        lastName: {
          type: "string",
          filters: [{ value: "home", operator: "LIKE" }],
        },
      });
      expect(result.count).toEqual(1);
      expect(result.nodes[0].firstName).toEqual("Molly");
    });

    it("filter by a specific text with one result", async () => {
      const result = await query({
        lastName: { type: "string", filters: [{ value: "home" }] },
      });
      expect(result.count).toEqual(1);
      expect(result.nodes[0].firstName).toEqual("Molly");
    });
  });
});
