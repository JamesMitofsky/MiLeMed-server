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
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Module extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @ManyToOne(() => Course, (course) => course.modules)
  @JoinColumn({ name: 'modeId' })
  courses: Course;

  @Field()
  @ManyToOne(() => Module, (module) => module.children, { nullable: true })
  @JoinColumn({ name: 'parentModuleId' })
  parentModule: Module;

  @Field()
  @OneToMany(() => Module, (module) => module.parentModule)
  children: Module[];

  @Field()
  @OneToMany(() => Lecture, (lecture) => lecture.module)
  lectures: Lecture[];

  @Field()
  @ManyToMany(() => Tag, (tag) => tag.modules)
  @JoinTable()
  tags: Tag[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
