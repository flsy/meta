# MetaFilters


![Build and Test](https://github.com/flsy/metafilters/workflows/Build%20and%20Test/badge.svg?branch=master)


### Usage

```Typescript
import metafilters from "metafilters";

const { nodes, count, cursor } = await metafilters(database.getRepository(PersonEntity), {
  filters: {
    firstName: { type: "string", value: "Joe" },
    age: {
      type: "number",
      filters: [
        { operator: "GE", value: 21 },
        { operator: "LE", value: 60 },
      ],
    },
  },
  sort: { age: "DESC" },
  limit: 10,
});
```

### Install

- Npm: `npm install metafilters`
- Yarn: `yarn add metafilters`


### API

#### Filters

##### String

```Typescript
interface IStringInput {
  type: "string";
  filters: {
    value: Nullable<string>;
    operator?: Nullable<"EQ" | "LIKE">; // defaults to LIKE
  }[];
}
```

##### Number
```Typescript
interface INumberInput {
  type: "number";
  filters: {
    value: Nullable<number>;
    operator?: "GT" | "LT" | "GE" | "LE" | "EQ" | "NE"; // defaults to EQ
  }[];
}
```

with little explanation of those operators:
- `EQ` - Equal to
- `NE` - Not equal to
- `GT` - Greater than
- `GE` - Greater than or equal to
- `LT` - Less than
- `LE` - Less than or equal to

##### Boolean
```Typescript
interface IBooleanInput {
  type: "boolean";
  value: Nullable<boolean>;
}
```


...more filters to come!


#### Cursor
...
