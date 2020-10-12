import { createTestClient } from 'apollo-server-testing';
import { ApolloServer, gql } from 'apollo-server';
import { makeSchema, objectType } from '@nexus/schema';
import { metatable } from '../metatable';
import { IColumn } from '../interfaces';
import {
  Column,
  createConnection,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IPaginatorArguments } from 'metafilters/lib/interfaces';
import { toPaginatedResponse } from 'metafilters';
import { Nullable } from '../example/interfaces';

@Entity()
class NameEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column()
  lastName?: string;
}

@Entity()
class AuthorEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => NameEntity)
  @JoinColumn()
  name!: string;

  @OneToMany(() => PhotoEntity, (photo) => photo.author, { nullable: true, lazy: true })
  photos?: Promise<PhotoEntity[]>;
}

// tslint:disable-next-line:max-classes-per-file
@Entity()
class PhotoEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  number!: number;

  @Column("boolean", { nullable: true })
  isArchived?: Nullable<boolean>;

  @ManyToOne(() => AuthorEntity, (author) => author.photos, { lazy: true })
  @JoinColumn()
  author?: Promise<AuthorEntity>;
}


const getConnection = async () =>
  createConnection({
    type: "sqlite",
    database: ":memory:",
    entities: [NameEntity, AuthorEntity, PhotoEntity],
    synchronize: true,
    // logging: true,
  });


const Name = objectType({
  name: "Name",
  definition: (t) => {
    t.int("id");
    t.string("firstName");
    t.string("lastName");
  },
});

const Author = objectType({
  name: "Author",
  definition: (t) => {
    t.int("id");
    t.field("name", { type: Name });
    t.field("photos", { type: Photo, nullable: true, list: true })
  },
});


const Photo = objectType({
  name: "Photo",
  definition: (t) => {
    t.int("id");
    t.int("name");
    t.boolean("isArchived", { nullable: true });
  },
});


const authors: IColumn[] = [
  { type: "number", path: ["id"], label: 'ID', key: true, isSortable: true, isFilterable: true },
  { type: "string", path: ["name", "lastName"], label: 'Last name', isSortable: true, isFilterable: true },
  { type: "string", path: ["name", "firstName"],label: 'First name', isSortable: true, isFilterable: true },
  { type: "string", path: ["photos", "name"], label: 'Photo names', isSortable: true, isFilterable: true },
]

const photos: IColumn[] = [
  { type: "number", path: ["id"] },
  { type: "number", path: ["number"], label: 'number', isSortable: true, isFilterable: true },
  // { path: "authors", value: authors }
];

const person = metatable(Author, "PersonListPaginated", authors);
const photo = metatable(Photo, "PhotoListPaginated", photos);

describe('metatable', () => {
  it('works', async () => {


      const database = await getConnection();

    const authorsQuery = (type: any, args: any) => ({
      type,
      args,
      nullable: true,
      resolve: async (parent: AuthorEntity, args: IPaginatorArguments<AuthorEntity>) => {
        return toPaginatedResponse(database.getRepository(AuthorEntity), args, ["photos", "name"]);
      },
    });
    const photosQuery = (type: any, args: any) => ({
      type,
      nullable: true,
      args,
      resolve: async (parent: PhotoEntity, args: IPaginatorArguments<PhotoEntity>) => {
        return toPaginatedResponse(database.getRepository(PhotoEntity), args, ["authors"])
      },
    });

    const Query = objectType({
      name: "Query",
      definition: (t) => {
        t.field("authors", authorsQuery(person.type, person.args));
        t.field("photos", photosQuery(photo.type, photo.args));
      },
    });

    const server = new ApolloServer({
      schema: makeSchema({
        types: [Query],
        outputs: {}
      }),
    });

    const { query } = createTestClient(server as any);

    // await seed(database);


      const QUERY = gql`
        query {
            authors {
                columns {
                    type
                    key
                    label
                    path
                }
                nodes {
                    id
                    name {
                        firstName
                    }
                    photos {
                        name
                    }
                }
                count
            }
        }

    `;

    const response = await query({ query: QUERY, variables: { id: 1 } });


    expect(response.errors).toEqual(undefined)
    expect(response.data).toEqual({
      authors: {
        columns: [
          {
            label: 'ID',
            key: true,
            path: ['id'],
            type: 'number'
          },
          {
            key: null,
             label: "Last name",
             path: ["name", "lastName"],
             type: "string",
          },
          {
            key: null,
            label: "First name",
            path: ["name", "firstName"],
            type: "string",
          },
          {
            key: null,
            label: "Photo names",
            path: ["photos", "name"],
            type: "string",
          },
          ],
        nodes: [],
        count: 0
      }
    })
  })
})
