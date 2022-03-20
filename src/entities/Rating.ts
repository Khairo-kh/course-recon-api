import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Float, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Rating {
    @Field()
    @PrimaryKey()
    id!: number;

    @Field()
    @Property({ type: 'text' })
    title!: string;

    @Field()
    @Property()
    description!: string;

    @Field()
    @Property({ default: 'NOW()' })
    createdAt: Date = new Date();

    @Field()
    @Property({ onUpdate: () => new Date(), default: 'NOW()' })
    updatedAt: Date = new Date();

    @Field(() => Float)
    @Property({ type: 'float' })
    scale!: number;
}
