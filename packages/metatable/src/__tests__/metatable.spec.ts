import { createTestClient } from 'apollo-server-testing';
import { ApolloServer, gql } from 'apollo-server';
import { makeSchema, objectType } from '@nexus/schema';
import { metatable } from '../metatable';
import { createConnection } from 'typeorm';
import { AuthorEntity, NameEntity, PhotoEntity } from '../example/entities';
import { Author, authorsQuery } from '../example/types';
import { authors, seed } from '../example/data';

const getConnection = async () =>
  createConnection({
    type: "sqlite",
    database: ":memory:",
    entities: [NameEntity, AuthorEntity, PhotoEntity],
    synchronize: true,
    // logging: true,
  });


describe('metatable', () => {
  it('works', async () => {

    const database = await getConnection();
    await seed(database);

    const author = metatable(Author, "AuthorListPaginated", authors);

    const Query = objectType({
      name: "Query",
      definition: (t) => {
        t.field("authors", authorsQuery(database.getRepository(AuthorEntity), author.type, author.args));
      },
    });

    const server = new ApolloServer({
      schema: makeSchema({
        types: [Query],
        outputs: {}
      }),
    });

    const { query } = createTestClient(server);

    const QUERY = gql`
      query {
          authors {
              columns {
                  id {
                      key
                      type
                      label
                  }
                  credit {
                      key
                      type
                      label
                      filterForm {
                          credit {
                              type
                              label
                          }
                          submit {
                              type
                              label
                          }
                      }
                  }
                  name {
                      firstName {
                          key
                          type
                          label
                          filterForm {
                              firstName {
                                  label
                                  type
                              }
                              submit {
                                  type
                                  label
                              }
                          }
                      }
                      lastName {
                          key
                          type
                          label
                      }
                  }
              }
              nodes {
                  id
                  name {
                      firstName
                      lastName
                  }
                  photos {
                      title
                      isPublished
                  }
                  credit
              }
              count
          }
      }
    `;

    const response = await query({ query: QUERY, variables: { id: 1 } });

    expect(response.errors).toEqual(undefined)
    expect(response.data).toEqual({
      authors: {
        columns: {
          id: {
            key: true,
            type: 'number',
            label: 'Id'
          },
          credit: {
            key: false,
            type: 'number',
            label: 'Credit',
            filterForm: {
              credit: {
                type: 'number',
                label: 'Filter by authors credit'
              },
              submit: {
                type: 'submit',
                label: 'Filter!'
              }
            }
          },
          name: {
            firstName: {
              key: false,
              type: 'string',
              label: 'FirstName',
              filterForm: {
                firstName: {
                  label: null,
                  type: 'string'
                },
                submit: {
                  label: 'Fitruj!',
                  type: 'submit'
                }
              }
            },
            lastName: {
              key: false,
              type: 'string',
              label: 'LastName'
            }
          }
        },
        nodes: [
          {
            "credit": 5,
            "id": 1,
            "name": {
              "firstName": "Paige",
              "lastName": "Turner"
            },
            "photos": [
              {
                "isPublished": true,
                "title": "a blueberry"
              },
              {
                "isPublished": true,
                "title": "a car"
              },
              {
                "isPublished": false,
                "title": "a dinosaur"
              }
            ]
          },
          {
            "credit": 20,
            "id": 2,
            "name": {
              "firstName": "Anne",
              "lastName": "Teak"
            },
            "photos": []
          },
          {
            "credit": 3,
            "id": 3,
            "name": {
              "firstName": null,
              "lastName": "Twishes"
            },
            "photos": [
              {
                "isPublished": false,
                "title": "a random thing"
              }
            ]
          },
          {
            "credit": 5,
            "id": 4,
            "name": {
              "firstName": "Amanda",
              "lastName": "Hug"
            },
            "photos": [
              {
                "isPublished": true,
                "title": "bus"
              },
              {
                "isPublished": true,
                "title": "car"
              },
              {
                "isPublished": true,
                "title": "plane"
              }
            ]
          },
          {
            "credit": 5,
            "id": 5,
            "name": {
              "firstName": "Ben",
              "lastName": "Dover"
            },
            "photos": []
          },
          {
            "credit": 7,
            "id": 6,
            "name": {
              "firstName": null,
              "lastName": "Dover"
            },
            "photos": [
              {
                "isPublished": true,
                "title": "blueberry"
              },
              {
                "isPublished": true,
                "title": "strawberry"
              }
            ]
          },
          {
            "credit": 5,
            "id": 7,
            "name": {
              "firstName": "Willie",
              "lastName": "Makit"
            },
            "photos": []
          },
          {
            "credit": 0,
            "id": 8,
            "name": {
              "firstName": "Skye",
              "lastName": "Blue"
            },
            "photos": []
          }
        ],
        count: 8
      }
    })
  })
})
