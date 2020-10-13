import { IAuthorTable, INameTable, IPhotoTable } from './interfaces';
import { Connection } from 'typeorm';
import { AuthorEntity, NameEntity, PhotoEntity } from './entities';

export const mockData = [
  {
    credit: 5,
    name: { firstName: 'Paige', lastName: 'Turner' },
    photos: [
      { title: 'a car', isPublished: true },
      { title: 'a blueberry', isPublished: true },
      { title: 'a dinosaur', isPublished: false }
    ]
  },
  {
    credit: 20,
    name: { firstName: "Anne", lastName: "Teak" },
    photos: []
  },
  {
    credit: 3,
    name: { lastName: "Twishes" },
    photos: [
      { title: 'a random thing', isPublished: false },
    ]
  },
  {
    credit: 5,
    name: { firstName: "Amanda", lastName: "Hug" },
    photos: [
      { title: 'plane', isPublished: true },
      { title: 'car', isPublished: true },
      { title: 'bus', isPublished: true },
    ]
  },
  {
    credit: 5,
    name: { firstName: "Ben", lastName: "Dover" },
    photos: []
  },
  {
    credit: 7,
    name: { lastName: "Dover" },
    photos: [
      { title: 'blueberry', isPublished: true },
      { title: 'strawberry', isPublished: true },
    ]
  },
  {
    credit: 5,
    name: { firstName: "Willie", lastName: "Makit" },
    photos: []
  },
  {
    credit: 0,
    name: { firstName: "Skye", lastName: "Blue" },
    photos: []
  },
];

export const seed = async (database: Connection) => {

  const names = mockData.map(d => d.name).map(name => {
    const entity = new NameEntity()
    entity.firstName = name.firstName
    entity.lastName = name.lastName
    return entity;
  });

  await database.getRepository(NameEntity).save(names);

  const authors = mockData.map(d => d.credit).map((credit, index) => {
    const entity = new AuthorEntity()
    entity.credit = credit
    entity.name = Promise.resolve(names[index]);

    return entity;
  })
  await database.getRepository(AuthorEntity).save(authors);

  const photos = mockData.map(d => d.photos).reduce<any>((all, current, index) => {
    return [...all, ...current.map(p => {
      const entity = new PhotoEntity();
      entity.title = p.title;
      entity.isPublished = p.isPublished;
      entity.author = Promise.resolve(authors[index]);
      return entity;
    })]
  }, [])
  await database.getRepository(PhotoEntity).save(photos);
};

export const name: INameTable = {
  id: {
    type: 'number',
  },
  firstName: {
    label: 'FirstName',
    type: 'string',
    filterForm: {
      firstName: {
        type: 'string'
      },
      submit: {
        label: 'Fitruj!',
        type: 'submit'
      }
    },
  },
  lastName: {
    label: 'LastName',
    type: 'string',
    filterForm: {
      lastName: {
        type: 'string'
      },
      submit: {
        type: 'submit'
      }
    },
  },
}

const photo: IPhotoTable = {
  id: {
    type: 'number',
    label: 'photo id',
    filterForm: {
      id: {
        type: 'number'
      },
      submit: {
        type: 'submit'
      }
    },
  },
  isPublished: {
    type: 'boolean'
  },
  title: {
    type: 'string'
  }
}

export const authors: IAuthorTable = {
  id: {
    label: 'Id',
    type: 'number',
    key: true
  },
  credit: {
    label: 'Credit',
    type: 'number',
    filterForm: {
      credit: {
        label: 'Filter by authors credit',
        type: 'number'
      },
      submit: {
        label: 'Filter!',
        type: 'submit'
      }
    }
  },
  name,
  photo
}
