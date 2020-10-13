import { objectType } from '@nexus/schema';
import { AuthorEntity, PhotoEntity } from './entities';
import { IPaginatorArguments } from 'metafilters/lib/interfaces';
import { toPaginatedResponse } from 'metafilters';
import { Repository } from 'typeorm';

const Name = objectType({
  name: "Name",
  definition: (t) => {
    t.int("id");
    t.string("firstName", { nullable: true });
    t.string("lastName");
  },
});

export const Author = objectType({
  name: "Author",
  definition: (t) => {
    t.int("id");
    t.field("name", { type: Name, nullable: true });
    t.int("credit");
    t.field("photos", { type: Photo, nullable: true, list: true })
  },
});

export const Photo = objectType({
  name: "Photo",
  definition: (t) => {
    t.int("id");
    t.string("title");
    t.boolean("isPublished", { nullable: true });
  },
});


export const authorsQuery = (repository: Repository<AuthorEntity>, type: any, args: any) => ({
  type,
  args,
  nullable: true,
  resolve: async (parent: AuthorEntity, args: IPaginatorArguments<AuthorEntity>) => {
    return toPaginatedResponse(repository, args, ["photos", "name"]);
  },
});

export const photosQuery = (repository: Repository<PhotoEntity>, type: any, args: any) => ({
  type,
  nullable: true,
  args,
  resolve: async (parent: PhotoEntity, args: IPaginatorArguments<PhotoEntity>) => {
    return toPaginatedResponse(repository, args, ["author"])
  },
});
