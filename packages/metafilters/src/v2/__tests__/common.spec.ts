import metafilters from "../index";
import { all, close } from "../sqliteUtils";
import { exampleColumn, seed } from "../testData";

describe("comon code", () => {
  it("map records to table column names", async () => {
    const db = await seed();
    const response = await metafilters(exampleColumn, "person-dash");

    const nodes = await all(db, response.nodes);
    await close(db);

    expect(response).toMatchObject({
      count: 'SELECT COUNT(*) as count FROM "person-dash";',
      nodes: 'SELECT "id", "firstName", "lastName", "age", "isValid" FROM "person-dash";',
    });

    expect(nodes).toEqual([
      { id: 1, firstName: "Joe", lastName: "Forest", age: 52, isValid: 0 },
      { id: 2, firstName: "Alpha", lastName: "Tree", age: 2, isValid: 1 },
      { id: 3, firstName: "Beta", lastName: "Woods", age: 30, isValid: 1 },
      { id: 5, firstName: "Carol", lastName: "RainForest", age: 18, isValid: 1 },
    ]);
  });
});
