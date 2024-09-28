import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { StudyModule } from './StudyModule';
import { ModeEnum } from '../types/modeEnum';

registerEnumType(ModeEnum, {
  name: 'mode', // Mandatory
  description: 'The roles of the user', // Optional
});

@ObjectType()
@Entity()
export class Course extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => ModeEnum)
  @Column({
    type: 'enum',
    enum: ModeEnum,
  })
  role: ModeEnum;

  @Field(() => StudyModule)
  @OneToMany(() => StudyModule, (module) => module.courses)
  modules: StudyModule[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
