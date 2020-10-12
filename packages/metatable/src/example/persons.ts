import { objectType } from "@nexus/schema";
import { PersonEntity } from "./entities";
import { Train } from './trains';
import { toPaginatedResponse } from 'metafilters';
import { IPaginatorArguments } from 'metafilters/lib/interfaces';

export const Person = objectType({
  name: "Person",
  definition: (t) => {
    t.int("id");
    t.string("firstName");
    t.string("lastName");
    t.int("age", { nullable: true });
    t.boolean("isArchived", { nullable: true });
    t.field("train", { type: Train, nullable: true });
  },
});

export const personsQuery = (type: any, args: any) => ({
  type,
  args,
  nullable: true,
  resolve: async (parent: PersonEntity, args: IPaginatorArguments<PersonEntity>, { database }: any) => {
    return toPaginatedResponse(database.getRepository(PersonEntity), args, ["train"]);
  },
});


