import { Field, Float, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './Course';
import { User } from './User';

@ObjectType()
@Entity()
export class Rating extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  description!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field(() => Float)
  @Column({ type: 'float' })
  scale!: number;

  @Field()
  @Column()
  reviewerId!: number;

  @Field()
  @Column()
  courseId!: number;

  @ManyToOne(() => User, (user) => user.ratings)
  reviewer!: User;

  @ManyToOne(() => Course, (course) => course.ratings)
  course!: Course;
}
