import { objectType } from "@nexus/schema";
import { TrainEntity } from "./entities";
import { Person } from './persons';
import { toPaginatedResponse } from 'metafilters';
import { IPaginatorArguments } from 'metafilters/lib/interfaces';

export const Train = objectType({
  name: "Train",
  definition: (t) => {
    t.int("id");
    t.int("number");
    t.field("persons", { type: Person, list: true, nullable: true });
  },
});

export const trainsQuery = (type: any, args: any) => ({
  type,
  nullable: true,
  args,
  resolve: async (parent: TrainEntity, args: IPaginatorArguments<TrainEntity>, { database }: any) => {
    return toPaginatedResponse(database.getRepository(TrainEntity), args, ["persons"])
  },
});
