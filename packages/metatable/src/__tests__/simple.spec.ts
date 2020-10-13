import { createTestClient } from 'apollo-server-testing';
import { ApolloServer, gql } from 'apollo-server';
import { makeSchema, objectType } from '@nexus/schema';
import { metatable } from '../metatable';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { toPaginatedResponse, IPaginatorArguments } from 'metafilters';
import { IForm } from 'metaforms';
import { IColumnBody, ITable } from '../interfaces';
import { getConnection } from '../example';

// TypeORM Entity
@Entity()
class ContactEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  firstName?: string;
}


// Define GraphQL node
const Contact = objectType({
  name: "Contact",
  definition: (t) => {
    t.int("id");
    t.string("firstName");
  },
});

// Define interfaces
interface IInput<Type> {
  type: Type;
  placeholder?: string;
  label?: string;
  value?: number;
}

interface ISubmitInput {
  type: 'submit';
  label?: string;
}

type IFilterForm = IForm<{ submit: ISubmitInput }>
type IStringForm<Name extends string> = IForm<{ [key in Name]: IInput<'string'> } & IFilterForm>
type INumberForm<Name extends string> = IForm<{ [key in Name]: IInput<'number'> } & IFilterForm>

interface IStringColumn<Name extends string>  extends IColumnBody<IStringForm<Name>> {
  type: 'string';
}

interface INumberColumn<Name extends string> extends IColumnBody<INumberForm<Name>> {
  type: 'number';
}

type IContactTable = ITable<{
  id: INumberColumn<'id'>;
  firstName: IStringColumn<'firstName'>;
}>;

// Specify column structure
const contacts: IContactTable = {
  id: {
    type: 'number',
    label: 'Id',
    key: true,
    filterForm:{
      id: {
        type: 'number',
        label: 'Filter by Id',
      },
      submit: {
        type: 'submit',
        label: 'Filter'
      }
    }
  },
  firstName: {
    type: 'string',
    label: 'First name',
    filterForm: {
      firstName :{
        type: 'string',
        label: 'Filter by first name'
      },
      submit: {
        type: 'submit',
        label: 'Filter'
      }
    }
  }
};

describe('simple metatable usage', () => {
  it('demoes the functionality', async () => {
    const database = await getConnection([ContactEntity]);

    // seed some data
    await database.getRepository(ContactEntity).save(['Paul' ,'Darcie', 'Molly', 'Kye', 'Tina', 'Emmie'].map(name => {
      const entity = new ContactEntity()
      entity.firstName = name
      return entity;
    }))

    const Query = objectType({
      name: "Query",
      definition: (t) => {
        const { type, args } = metatable(Contact, "ContactsList", contacts);

        t.field("contacts", {
          type,
          args,
          nullable: true,
          resolve: async (parent: ContactEntity, args: IPaginatorArguments<ContactEntity>) =>
            toPaginatedResponse(database.getRepository(ContactEntity), args)
        });
      },
    });

    const server = new ApolloServer({
      schema: makeSchema({
        types: [Query],
        outputs: {}
      }),
    });

    const { query } = createTestClient(server);

    const response = await query({ query: gql`
        query {
            contacts {
                columns {
                    id {
                        key
                        type
                        label
                        filterForm {
                            id {
                                type
                                label
                            }
                            submit {
                                type
                                label
                            }
                        }
                    }
                    firstName {
                        key
                        type
                        label
                        filterForm {
                            firstName {
                                type
                                label
                            }
                            submit {
                                type
                                label
                            }
                        }
                    }
                }
                nodes {
                    id
                    firstName
                }
                count
            }
        }
    `});

    expect(response.errors).toEqual(undefined)
    expect(response.data).toMatchObject({
      contacts: {
        columns: {
          firstName: {
            filterForm: {
              firstName: {
                label: 'Filter by first name',
                  type: 'string',
              },
              submit: {
                label: 'Filter',
                  type: 'submit',
              },
            },
            key: false,
              label: 'First name',
              type: 'string',
          },
          id: {
            filterForm: {
              id: {
                label: 'Filter by Id',
                  type: 'number',
              },
              submit: {
                label: 'Filter',
                  type: 'submit',
              },
            },
            key: true,
              label: 'Id',
              type: 'number',
          },
        },
        count: 6,
          nodes: [
          {
            firstName: 'Paul',
            id: 1,
          },
          {
            firstName: 'Darcie',
            id: 2,
          },
          {
            firstName: 'Molly',
            id: 3,
          },
          {
            firstName: 'Kye',
            id: 4,
          },
          {
            firstName: 'Tina',
            id: 5,
          },
          {
            firstName: 'Emmie',
            id: 6,
          },
        ],
      },
    })
  })
})
