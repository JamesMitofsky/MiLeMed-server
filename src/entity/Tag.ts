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
import { ObjectType } from 'type-graphql';
import { Module } from './Module';

@ObjectType()
@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Module, (module) => module.tags)
  modules: Module[];

  @ManyToMany(() => Lecture, (lecture) => lecture.tags)
  lectures: Lecture[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
