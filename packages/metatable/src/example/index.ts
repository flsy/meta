import { ApolloServer } from "apollo-server";
import { makeSchema, objectType } from '@nexus/schema';
import { Connection, createConnection } from 'typeorm';
import { Person, personsQuery } from './persons';
import { Train, trainsQuery } from './trains';
import { PersonEntity, TrainEntity } from './entities';
import { IColumn } from '../interfaces';
import { metatable } from '../metatable';
import * as path from 'path';


const persons: IColumn[] = [
  { type: "number", path: ["id"], label: 'ID', key: true, isSortable: true, isFilterable: true },
  { type: "string", path: ["lastName"], label: 'Last name', isSortable: true, isFilterable: true },
  { type: "string", path: ["firstName"],label: 'First name', isSortable: true, isFilterable: true },
  { type: "number", path: ["age"], label: 'Age', isSortable: true, isFilterable: true },
  { type: "boolean", path: ["isArchived"], label: 'Is archived', isSortable: true, isFilterable: true },
  { type: "number", path: ["train", "number"], label: 'Train number', isSortable: true, isFilterable: true },
  { type: "number", path: ["train", "id"], label: 'Train id', isSortable: true, isFilterable: true },
]

const trains: IColumn[] = [
  { type: "number", path: ["id"], key: true },
  { type: "number", path: ["number"], label: 'Number', isSortable: true, isFilterable: true },
];

const person = metatable(Person, "PersonList", persons);
const train = metatable(Train, "TrainList", trains);

const Query = objectType({
  name: "Query",
  definition: (t) => {
    t.field("persons", personsQuery(person.type, person.args));
    t.field("trains", trainsQuery(train.type, train.args));
  },
});

const seed = async (database: Connection) => {
  const persons = [
    { firstName: "Paige", lastName: "Turner", age: 2, isArchived: false },
    { firstName: "Anne", lastName: "Teak", age: 3 },
    { firstName: "Bess", lastName: "Twishes", age: null },
    { firstName: "Amanda", lastName: "Hug" },
    { firstName: "Ben", lastName: "Dover" },
    { firstName: "Eileen", lastName: "Dover" },
    { firstName: "Willie", lastName: "Makit" },
    { firstName: "Skye", lastName: "Blue", age: 20 },
    { firstName: "Addie", lastName: "Minstra" },
    { firstName: "Dee", lastName: "Zynah", isArchived: false },
    { firstName: "Manny", lastName: "Jah" },
    { firstName: "Reeve", lastName: "Ewer", age: 32 },
    { firstName: "Theresa", lastName: "Green", isArchived: false },
    { firstName: "Barry", lastName: "Kade" },
    { firstName: "Stan", lastName: "Dupp", isArchived: true },
    { firstName: "Neil", lastName: "Down" },
    { firstName: "Con", lastName: "Trariweis", age: 33 },
    { firstName: "Don", lastName: "Messwidme" },
    { firstName: "Al", lastName: "Annon" },
    { firstName: "Anna", lastName: "Domino", age: 30 },
    { firstName: "Anna", lastName: "Logwatch", age: 90, isArchived: true },
    { firstName: "Anna", lastName: "Littlical", isArchived: false },
  ];

  const result = await database.getRepository(PersonEntity).save(persons);

  const train1 = new TrainEntity();
  train1.number = 750;
  train1.persons = Promise.resolve(result);

  const train2 = new TrainEntity();
  train2.number = 800;

  const train3 = new TrainEntity();
  train3.number = 850;
  train3.persons = Promise.resolve([result[0], result[1], result[2], result[3]]);

  await database.getRepository(TrainEntity).save([train1, train2, train3]);
};

const getConnection = async () =>
  createConnection({
    type: "sqlite",
    database: ":memory:",
    entities: [PersonEntity, TrainEntity],
    synchronize: true,
    // logging: true,
  });

const main = async () => {
  const database = await getConnection();

  await seed(database);

  new ApolloServer({
    cors: {
      origin: '*',
      credentials: true
    },
    schema: makeSchema({
      types: [Query],
      outputs: {
        schema: path.join(__dirname, '../../schema.graphql'),
      },
    }),
    context: () => ({
      database,
    }),
  })
    .listen(4000)
    .then(({ url }) => {
      // tslint:disable-next-line:no-console
      console.log(`🚀  Server ready at ${url}`);
    });
};

main();
