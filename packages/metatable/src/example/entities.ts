import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => TrainEntity, (train) => train.persons, { nullable: true, lazy: true })
  train?: Promise<TrainEntity>;
}

// tslint:disable-next-line:max-classes-per-file
@Entity()
export class TrainEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  number!: number;

  @OneToMany(() => PersonEntity, (person) => person.train, { lazy: true })
  persons?: Promise<PersonEntity[]>;
}
