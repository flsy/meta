# MetaTable

`npm i metatable --save`


# development

you can fire up local graphQL server with test data by running `yarn dev` and visit playground on [http://localhost:4000/](http://localhost:4000/).

# usage

Complete example is covered in this test file [simple.spec.ts](src/__tests__/simple.spec.ts).

```typescript
import { objectType } from '@nexus/schema';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { metatable } from 'metatable';
import { toPaginatedResponse, IPaginatorArguments } from 'metafilters';

// Define Entity
@Entity()
class ContactEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  firstName?: string;
}

// Define GraphQL object
const Contact = objectType({
  name: "Contact",
  definition: (t) => {
    t.int("id");
    t.string("firstName");
  },
});

// Define table structure
const contacts = {
  id: {
    type: 'number',
    label: 'Id',
    key: true,
    filterForm: {
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
      firstName: {
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

// and you're ready to integrate it into graphQL schema
const Query = objectType({
  name: "Query",
  definition: (t) => {
    const { type, args } = metatable(Contact, "ContactsList", contacts);

    t.field("contacts", {
      type,
      args,
      nullable: true,
      resolve: async (parent, args: IPaginatorArguments<ContactEntity>) =>
        toPaginatedResponse(database.getRepository(ContactEntity), args)
    });
  },
});

```
