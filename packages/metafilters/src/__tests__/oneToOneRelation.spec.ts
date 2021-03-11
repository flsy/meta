import { Connection } from "typeorm";
import { getConnection } from "../testHelpers";
import { PersonEntity, ProfileEntity } from "../testEntities";
import metafilters from "../index";
import { encodeCursor } from "../paginate/paginate";

describe("oneToOneRelation", () => {
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

    const profile1 = new ProfileEntity();
    profile1.username = "molly";
    profile1.person = Promise.resolve(person1);
    await connection.manager.save(profile1);

    const person2 = new PersonEntity();
    person2.firstName = "Oscar";
    person2.lastName = "Nommanee";
    await connection.manager.save(person2);

    const profile2 = new ProfileEntity();
    profile2.username = "oscar";
    profile2.person = Promise.resolve(person2);
    await connection.manager.save(profile2);

    const profileRepository = connection.getRepository(ProfileEntity);

    const result = await metafilters<ProfileEntity>(
      profileRepository,
      {
        filters: { person: { firstName: { type: "string", filters: [{ operator: "LIKE", value: "moll" }] } } },
      },
      ["person"]
    );

    expect(result.count).toEqual(1);
    expect(result.nodes).toMatchObject([
      {
        id: 1,
        username: "molly",
        person: {
          id: 1,
          firstName: "Molly",
          lastName: "Homesoon",
          age: null,
          isArchived: null,
        },
      },
    ]);
  });

  it("creates 3 profiles trains and 3 peoples and returns only 2 profiles", async () => {
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

    const profile1 = new ProfileEntity();
    profile1.username = "molly";
    profile1.person = Promise.resolve(person1);

    const profile2 = new ProfileEntity();
    profile2.username = "oscar";
    profile2.person = Promise.resolve(person2);

    const profile3 = new ProfileEntity();
    profile3.username = "greg";
    profile3.person = Promise.resolve(person3);

    await connection.manager.save([profile1, profile2, profile3]);

    const profileRepository = connection.getRepository(ProfileEntity);

    const result1 = await metafilters<ProfileEntity>(profileRepository, { limit: 2 }, ["person"]);

    expect(result1.count).toEqual(3);
    expect(result1.nodes).toMatchObject([
      {
        id: 1,
        username: "molly",
        person: {
          age: null,
          firstName: "Molly",
          id: 1,
          isArchived: null,
          lastName: "Homesoon",
        },
      },
      {
        id: 2,
        username: "oscar",
        person: {
          age: null,
          firstName: "Oscar",
          id: 2,
          isArchived: null,
          lastName: "Nommanee",
        },
      },
    ]);
    expect(result1.cursor).toEqual("%7B%22id%22:2%7D");

    const result2 = await metafilters<ProfileEntity>(profileRepository, { limit: 2, cursor: result1.cursor }, ["person"]);

    expect(result2.count).toEqual(3);
    expect(result2.cursor).toEqual(undefined);
    expect(result2.nodes).toEqual([
      {
        id: 3,
        username: "greg",
        person: {
          age: null,
          firstName: "Greg",
          id: 3,
          isArchived: null,
          lastName: "Arias",
        },
      },
    ]);
  });

  it("creates 5 profiles and 5 peoples and filter and paginate them by one", async () => {
    const person1 = new PersonEntity();
    person1.firstName = "Molly";
    person1.lastName = "Homesoon";

    const person2 = new PersonEntity();
    person2.firstName = "Oscar";
    person2.lastName = "Arias";

    const person3 = new PersonEntity();
    person3.firstName = "Greg";
    person3.lastName = "Arias";

    const person4 = new PersonEntity();
    person4.firstName = "Beta";
    person4.lastName = "Arias";

    const person5 = new PersonEntity();
    person5.firstName = "Gamma";
    person5.lastName = "Arias";

    const person6 = new PersonEntity();
    person6.firstName = "Delta";
    person6.lastName = "Arias";

    await connection.manager.save([person1, person2, person3, person4, person5, person6]);

    const profile1 = new ProfileEntity();
    profile1.username = "molly";
    profile1.person = Promise.resolve(person1);

    const profile2 = new ProfileEntity();
    profile2.username = "oscar";
    profile2.person = Promise.resolve(person2);

    const profile3 = new ProfileEntity();
    profile3.username = "greg";
    profile3.person = Promise.resolve(person3);

    const profile4 = new ProfileEntity();
    profile4.username = "beta";
    profile4.person = Promise.resolve(person4);

    const profile5 = new ProfileEntity();
    profile5.username = "gamma";
    profile5.person = Promise.resolve(person5);

    const profile6 = new ProfileEntity();
    profile6.username = "delta";
    profile6.person = Promise.resolve(person6);

    await connection.manager.save([profile1, profile2, profile3, profile4, profile5, profile6]);

    const profileRepository = connection.getRepository(ProfileEntity);

    const result1 = await metafilters<ProfileEntity>(profileRepository, { limit: 2, filters: { person: { lastName: { type: "string", filters: [{ value: "Arias" }] } } } }, [
      "person",
    ]);

    expect(result1.count).toEqual(5);
    expect(result1.nodes).toMatchObject([
      {
        id: profile2.id,
        username: profile2.username,
        person: person2,
      },
      {
        id: profile3.id,
        username: profile3.username,
        person: person3,
      },
    ]);

    expect(result1.cursor).toEqual(encodeCursor({ id: profile3.id }));

    const result2 = await metafilters<ProfileEntity>(
      profileRepository,
      { limit: 2, filters: { person: { lastName: { type: "string", filters: [{ value: "Arias" }] } } }, cursor: result1.cursor },
      ["person"]
    );

    expect(result2.count).toEqual(5);
    expect(result2.cursor).toEqual(encodeCursor({ id: profile5.id }));
    expect(result2.nodes).toEqual([
      {
        id: profile4.id,
        username: profile4.username,
        person: person4,
      },
      {
        id: profile5.id,
        username: profile5.username,
        person: person5,
      },
    ]);

    const result3 = await metafilters<ProfileEntity>(
      profileRepository,
      { limit: 2, filters: { person: { lastName: { type: "string", filters: [{ value: "Arias" }] } } }, cursor: result2.cursor },
      ["person"]
    );

    expect(result3.count).toEqual(5);
    expect(result3.cursor).toEqual(undefined);
    expect(result3.nodes).toEqual([
      {
        id: profile6.id,
        username: profile6.username,
        person: person6,
      },
    ]);
  });
});
