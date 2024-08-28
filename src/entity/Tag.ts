import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Lecture } from './Lecture';
import { Field, ID, ObjectType } from 'type-graphql';
import { Module } from './Module';

@ObjectType()
@Entity()
export class Tag extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @ManyToMany(() => Module, (module) => module.tags)
  modules: Module[];

  @Field()
  @ManyToMany(() => Lecture, (lecture) => lecture.tags)
  lectures: Lecture[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
