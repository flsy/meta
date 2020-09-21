import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Nullable } from "./interfaces";

@Entity()
export class PersonEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column()
  lastName?: string;

  @Column("int", { nullable: true })
  age?: Nullable<number>;

  @Column("boolean", { nullable: true })
  isArchived?: Nullable<boolean>;

  @ManyToMany(() => TrainEntity, (train) => train.persons, { nullable: true, lazy: true })
  trains?: Promise<TrainEntity[]>;
}

// tslint:disable-next-line:max-classes-per-file
@Entity()
export class TrainEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  number!: number;

  @ManyToMany(() => PersonEntity, (person) => person.trains, { lazy: true })
  @JoinTable()
  persons?: Promise<PersonEntity[]>;
}
