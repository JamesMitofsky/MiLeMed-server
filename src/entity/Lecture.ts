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
import { ObjectType } from 'type-graphql';
import { Module } from './Module';

@ObjectType()
@Entity()
export class Lecture extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Module, (module) => module.lectures)
  @JoinColumn({ name: 'moduleId' })
  module: Module;

  @ManyToMany(() => Tag, (tag) => tag.lectures)
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
