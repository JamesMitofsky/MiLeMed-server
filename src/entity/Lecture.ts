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
import { StudyModule } from './StudyModule';
import { Image } from './Image';

@ObjectType()
@Entity()
export class Lecture extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Column()
  @Field()
  content: string;

  @Field(() => [Image])
  @ManyToMany(() => Image, (image) => image.lectures)
  @JoinTable()
  images: Image[];

  @Field(() => StudyModule)
  @ManyToOne(() => StudyModule, (module) => module.lectures)
  @JoinColumn({ name: 'moduleId' })
  module: StudyModule;

  @Field(() => Tag)
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
