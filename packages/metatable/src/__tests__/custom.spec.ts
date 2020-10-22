import { createTestClient } from 'apollo-server-testing';
import { ApolloServer, gql } from 'apollo-server';
import { arg, intArg, makeSchema, objectType, stringArg } from '@nexus/schema';
import { getObjectType } from '../metatable';
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
const contacts = (t = (i: string) => i): IContactTable => ({
  id: {
    type: 'number',
    label: t('Id'),
    isOmitted: true,
    key: true,
    filterForm: {
      id: {
        type: 'number',
        label: t('Filter by Id'),
      },
      submit: {
        type: 'submit',
        label: t('Filter')
      }
    }
  },
  firstName: {
    type: 'string',
    label: t('First name'),
    filterForm: {
      firstName :{
        type: 'string',
        label: t('Filter by first name')
      },
      submit: {
        type: 'submit',
        label: t('Filter')
      }
    }
  }
});

const coolTranslateFunction = (t: string) => `Translated ${t}`;

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
        const { filterObjectType, columnObjectType } = getObjectType('ContactList', contacts())

        t.field("contacts", {
          type: objectType({
            name: 'ContactListResponse',
            definition: (t) => {
              t.field('node', { type: Contact, list: [true], nullable: true, resolve: (p) => p.nodes });
              t.field('columns', { type: columnObjectType, nullable: true });
              t.string('cursor');
              t.int('count');

              t.string('status');
              t.string('statusMessage');
            },
          }),
          args: {
            limit: intArg(),
            cursor: stringArg(),
            filters: arg({ type: filterObjectType }),
          },
          nullable: true,
          resolve: async (parent: ContactEntity, args: IPaginatorArguments<ContactEntity>) => {

            const response = await toPaginatedResponse(database.getRepository(ContactEntity), args)
            return { status: 'SUC', statusMessage: 'OK', columns: contacts(coolTranslateFunction), ...response }
          }
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
                        isOmitted
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
                        isOmitted
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
                node {
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
                label: 'Translated Filter by first name',
                type: 'string',
              },
              submit: {
                label: 'Translated Filter',
                type: 'submit',
              },
            },
            key: false,
            isOmitted: false,
            label: 'Translated First name',
            type: 'string',
          },
          id: {
            filterForm: {
              id: {
                label: 'Translated Filter by Id',
                type: 'number',
              },
              submit: {
                label: 'Translated Filter',
                type: 'submit',
              },
            },
            key: true,
            isOmitted: true,
            label: 'Translated Id',
            type: 'number',
          },
        },
        count: 6,
          node: [
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
