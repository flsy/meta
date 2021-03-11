import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { Nullable } from './interfaces';

@Entity()
export class PersonEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column()
  lastName?: string;

  @Column('int', { nullable: true })
  age?: Nullable<number>;

  @Column('boolean', { nullable: true })
  isArchived?: Nullable<boolean>;

  @ManyToMany(() => TrainEntity, (train) => train.persons, { nullable: true, lazy: true })
  trains?: Promise<TrainEntity[]>;
}

// tslint:disable-next-line:max-classes-per-file
@Entity()
export class CoachEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  color?: string;

  @ManyToOne(() => TrainEntity, (train) => train.coaches, { nullable: true, lazy: true })
  train?: Promise<TrainEntity>;
}

// tslint:disable-next-line:max-classes-per-file
@Entity()
export class TrainEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  number!: number;

  @OneToMany(() => CoachEntity, (coach) => coach.train, { nullable: true, lazy: true })
  coaches?: Promise<CoachEntity[]>;

  @ManyToMany(() => PersonEntity, (person) => person.trains, { lazy: true })
  @JoinTable()
  persons?: Promise<PersonEntity[]>;
}

// tslint:disable-next-line:max-classes-per-file
@Entity()
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username?: string;

  @OneToOne(() => PersonEntity, { lazy: true })
  @JoinColumn()
  person?: Promise<PersonEntity>;
}
