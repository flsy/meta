import { exampleColumn, seed } from "../testData";
import metafilters from "../index";
import { all, close, get } from "../sqliteUtils";

describe("pagination", () => {
  it("paginate sorted by keyColumn ASC", async () => {
    const db = await seed();
    const response1 = await metafilters(exampleColumn, "person-dash", { limit: 3 });

    const count = await get(db, response1.count);
    const nodes = await all(db, response1.nodes);

    expect(count).toEqual({ count: 4 });
    expect(nodes.length).toEqual(3);

    expect(nodes).toEqual([
      { id: 1, age: 52, firstName: "Joe", isValid: 0, lastName: "Forest" },
      { id: 2, age: 2, firstName: "Alpha", isValid: 1, lastName: "Tree" },
      { id: 3, firstName: "Beta", lastName: "Woods", isValid: 1, age: 30 },
    ]);

    const response2 = await metafilters(exampleColumn, "person-dash", { page: 1, limit: 3 });
    const nodes2 = await all(db, response2.nodes);
    await close(db);
    expect(nodes2.length).toEqual(1);
    expect(nodes2).toEqual([{ id: 5, firstName: "Carol", lastName: "RainForest", isValid: 1, age: 18 }]);
  });

  it("paginate sorted by keyColumn DESC", async () => {
    const db = await seed();
    const response1 = await metafilters(exampleColumn, "person-dash", { limit: 3, sort: { id: "DESC" } });

    const count = await get(db, response1.count);
    const nodes = await all(db, response1.nodes);

    expect(count).toEqual({ count: 4 });
    expect(nodes.length).toEqual(3);

    expect(nodes).toEqual([
      { id: 5, firstName: "Carol", lastName: "RainForest", isValid: 1, age: 18 },
      { id: 3, firstName: "Beta", lastName: "Woods", isValid: 1, age: 30 },
      { id: 2, firstName: "Alpha", isValid: 1, lastName: "Tree", age: 2 },
    ]);

    const response2 = await metafilters(exampleColumn, "person-dash", { page: 1, limit: 3, sort: { id: "DESC" } });
    const nodes2 = await all(db, response2.nodes);
    await close(db);

    expect(nodes2.length).toEqual(1);
    expect(nodes2).toEqual([{ id: 1, age: 52, firstName: "Joe", isValid: 0, lastName: "Forest" }]);
  });

  it("return empty nodes with page number outside stored data", async () => {
    const db = await seed();
    const response1 = await metafilters(exampleColumn, "person-dash", { page: 10, limit: 3, sort: { firstName: "DESC" } });

    const count = await get(db, response1.count);
    const nodes = await all(db, response1.nodes);

    expect(count).toEqual({ count: 4 });
    expect(nodes.length).toEqual(0);
    expect(nodes).toEqual([]);
  });

  it("return all nodes without limit", async () => {
    const db = await seed();
    const response1 = await metafilters(exampleColumn, "person-dash", { sort: { firstName: "DESC" } });

    const count = await get(db, response1.count);
    const nodes = await all(db, response1.nodes);

    expect(count).toEqual({ count: 4 });
    expect(nodes.length).toEqual(4);

    const response2 = await metafilters(exampleColumn, "person-dash", { page: 10, sort: { firstName: "DESC" } });
    const count2 = await get(db, response2.count);
    const nodes2 = await all(db, response2.nodes);

    expect(count2).toEqual({ count: 4 });
    expect(nodes2.length).toEqual(4);
  });
});
