import { Field, Int, ObjectType } from 'type-graphql';
import { Rating } from './Rating';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Course extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Field(() => Int)
  @Column()
  externalId!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  subject!: string;

  @Field(() => Int)
  @Column()
  number!: number;

  @Field()
  @Column()
  prerequisites!: string;

  @Field()
  @Column()
  description!: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Rating, (rating) => rating.reviewer)
  ratings: Rating[];
}
