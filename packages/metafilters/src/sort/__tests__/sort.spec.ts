import "reflect-metadata";
import { Connection } from "typeorm";
import { PersonEntity } from "../../testEntities";
import metafilters from "../../index";
import { createPersons, getConnection } from "../../testHelpers";
import { Sort } from "../../interfaces";

describe("sort", () => {
  let connection: Connection;
  beforeEach(async () => {
    connection = await getConnection();
  });

  afterEach(async () => {
    await connection.close();
  });

  const query = async (sort?: Sort<PersonEntity>) => {
    const repository = connection.getRepository(PersonEntity);
    await createPersons(repository, [
      { firstName: "Molly", lastName: "Homesoon", isArchived: false, age: 50 },
      { firstName: "Greg", lastName: "Arias", isArchived: true, age: 40 },
      { firstName: "Lynne", lastName: "Gwistic", age: 30 },
      { firstName: "Oscar", lastName: "Nommanee", age: 40 },
    ]);
    return metafilters(repository, { sort });
  };

  it("return all records when no filter specified", async () => {
    const response = await query();

    expect(response.count).toEqual(4);
  });
  describe("by number field", () => {
    it("return dataset orders by age ASC", async () => {
      const response = await query({ age: "ASC" });

      expect(response.nodes.map(({ firstName, age }) => ({ firstName, age }))).toEqual([
        { firstName: "Lynne", age: 30 },
        { firstName: "Greg", age: 40 },
        { firstName: "Oscar", age: 40 },
        { firstName: "Molly", age: 50 },
      ]);
    });

    it("return dataset orders by age DESC", async () => {
      const response = await query({ age: "DESC" });

      expect(response.nodes.map(({ firstName, age }) => ({ firstName, age }))).toEqual([
        { firstName: "Molly", age: 50 },
        { firstName: "Greg", age: 40 },
        { firstName: "Oscar", age: 40 },
        { firstName: "Lynne", age: 30 },
      ]);
    });
  });

  describe("by text field", () => {
    it("return dataset orders by firstName ASC", async () => {
      const response = await query({ firstName: "ASC" });

      expect(response.nodes.map(({ firstName }) => firstName)).toEqual(["Greg", "Lynne", "Molly", "Oscar"]);
    });
    it("return dataset orders by firstName DESC", async () => {
      const response = await query({ firstName: "DESC" });

      expect(response.nodes.map(({ firstName }) => firstName)).toEqual(["Oscar", "Molly", "Lynne", "Greg"]);
    });
  });

  describe("by boolean field", () => {
    it("return dataset orders by isArchived ASC", async () => {
      const response = await query({ isArchived: "ASC" });

      expect(
        response.nodes.map(({ firstName, isArchived }) => ({
          firstName,
          isArchived,
        }))
      ).toEqual([
        { firstName: "Lynne", isArchived: null },
        { firstName: "Oscar", isArchived: null },
        { firstName: "Molly", isArchived: false },
        { firstName: "Greg", isArchived: true },
      ]);
    });
  });
});
