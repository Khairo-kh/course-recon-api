import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Rating {
    @PrimaryKey()
    id!: number;

    @Property({ type: 'text' })
    title!: string;

    // @Property()
    // description!: string;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    // @Property()
    // scale!: number;
}
