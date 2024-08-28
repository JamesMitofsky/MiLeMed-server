import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Tag } from './Tag';
import { Field, ID, ObjectType } from 'type-graphql';
import { Module } from './Module';

@ObjectType()
@Entity()
export class Lecture extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @ManyToOne(() => Module, (module) => module.lectures)
  @JoinColumn({ name: 'moduleId' })
  module: Module;

  @Field()
  @ManyToMany(() => Tag, (tag) => tag.lectures)
  @JoinTable()
  tags: Tag[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
