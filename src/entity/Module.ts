import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Course } from './Course';
import { Lecture } from './Lecture';
import { Tag } from './Tag';
import { ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Module extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Course, (course) => course.modules)
  @JoinColumn({ name: 'modeId' })
  courses: Course;

  @ManyToOne(() => Module, (module) => module.children, { nullable: true })
  @JoinColumn({ name: 'parentModuleId' })
  parentModule: Module;

  @OneToMany(() => Module, (module) => module.parentModule)
  children: Module[];

  @OneToMany(() => Lecture, (lecture) => lecture.module)
  lectures: Lecture[];

  @ManyToMany(() => Tag, (tag) => tag.modules)
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
