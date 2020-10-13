import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Nullable } from "./interfaces";

@Entity()
export class NameEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column()
  lastName?: string;

  @OneToOne(() => NameEntity, (x) =>x.id,  { lazy: true })
  author!: Promise<AuthorEntity>;
}

@Entity()
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  credit?: number;

  @OneToOne(() => NameEntity, (x) =>x.id,  { lazy: true })
  @JoinColumn()
  name!: Promise<NameEntity>;

  @OneToMany(() => PhotoEntity, (photo) => photo.author, { nullable: true, lazy: true })
  photos?: Promise<PhotoEntity[]>;
}

// tslint:disable-next-line:max-classes-per-file
@Entity()
export class PhotoEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column("boolean", { nullable: true })
  isPublished?: Nullable<boolean>;

  @ManyToOne(() => AuthorEntity, (author) => author.photos, { lazy: true })
  @JoinColumn()
  author?: Promise<AuthorEntity>;
}
