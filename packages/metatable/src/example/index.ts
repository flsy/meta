import { ApolloServer } from "apollo-server";
import { makeSchema, objectType } from '@nexus/schema';
import { createConnection } from 'typeorm';
import { AuthorEntity, NameEntity, PhotoEntity } from './entities';
import { metatable } from '../metatable';
import * as path from 'path';
import { Author, authorsQuery } from './types';
import { authors, seed } from './data';

const getConnection = async () =>
  createConnection({
    type: "sqlite",
    database: ":memory:",
    entities: [AuthorEntity, PhotoEntity, NameEntity],
    synchronize: true,
    // logging: true,
  });

const main = async () => {
  const database = await getConnection();
  await seed(database);

  const author = metatable(Author, "AuthorList", authors);

  const Query = objectType({
    name: "Query",
    definition: (t) => {
      t.field("authors", authorsQuery(database.getRepository(AuthorEntity), author.type, author.args));
    },
  });

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
