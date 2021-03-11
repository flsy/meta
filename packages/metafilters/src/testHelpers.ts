import "reflect-metadata";
import { createConnection, Repository } from "typeorm";
import { CoachEntity, PersonEntity, ProfileEntity, TrainEntity } from "./testEntities";

export const getConnection = async () =>
  createConnection({
    type: "sqlite",
    database: ":memory:",
    entities: [PersonEntity, TrainEntity, ProfileEntity, CoachEntity],
    synchronize: true,
    // logging: true,
  });

export const createPersons = async (repository: Repository<PersonEntity>, persons: Partial<PersonEntity>[]) =>
  repository.save(
    persons.map((option) => {
      const person = new PersonEntity();
      person.firstName = option.firstName;
      person.lastName = option.lastName;
      person.isArchived = option.isArchived;
      person.age = option.age;
      return person;
    })
  );
