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
