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
import { StudyModule } from './StudyModule';

@ObjectType()
@Entity()
export class Tag extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => StudyModule)
  @ManyToMany(() => StudyModule, (module) => module.tags)
  modules: StudyModule[];

  @Field(() => Lecture)
  @ManyToMany(() => Lecture, (lecture) => lecture.tags)
  lectures: Lecture[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
