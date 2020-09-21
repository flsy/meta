# MetaTable

`npm i metatable --save`


# usage

```typescript
import { objectType } from '@nexus/schema';
import { toPaginatedResponse, IPaginatorArguments } from 'metafilters';
import metatable, { IColumn } from 'metatable';


const persons: IColumn[] = [
  { type: "string", name: "lastName", label: 'Last name', isSortable: true, isFilterable: true },
  { type: "string", name: "firstName",label: 'First name', isSortable: true, isFilterable: true },
  { type: "number", name: "age", label: 'Age', isSortable: true, isFilterable: true },
  { type: "boolean", name: "isArchived", label: 'Is archived', isSortable: true, isFilterable: true },
  { path: 'trains', value: trains }
]

const trains: IColumn[] = [
  { type: "number", name: "id" },
  { type: "number", name: "number", label: 'number', isSortable: true, isFilterable: true },
  { path: "persons", value: persons }
];

const Person = objectType({
  name: "Person",
  definition: (t) => {
    t.int("id");
    t.string("firstName");
    t.string("lastName");
    t.int("age", { nullable: true });
    t.boolean("isArchived", { nullable: true });
    t.field("trains", { type: Train, list: true, nullable: true });
  },
});

const Train = objectType({
  name: "Train",
  definition: (t) => {
    t.int("id");
    t.int("number");
    t.field("persons", { type: Person, list: true, nullable: true });
  },
});

const trainsQuery = (type, args) => ({
  type,
  nullable: true,
  args,
  resolve: async (parent: TrainEntity, args: IPaginatorArguments<TrainEntity>, { database }) => {
    return toPaginatedResponse(database.getRepository(TrainEntity), args, ["persons"])
  },
});

const personsQuery = (type, args) => ({
  type,
  args,
  nullable: true,
  resolve: async (parent: PersonEntity, args: IPaginatorArguments<PersonEntity>, { database }) => {
    return toPaginatedResponse(database.getRepository(PersonEntity), args, ["trains"]);
  },
});

const person = metatable(Person, "PersonListPaginated", persons);
const train = metatable(Train, "TrainListPaginated", trains);

const Query = objectType({
  name: "Query",
  definition: (t) => {
    t.field("persons", personsQuery(person.type, person.args));
    t.field("trains", trainsQuery(train.type, train.args));
  },
});
```
