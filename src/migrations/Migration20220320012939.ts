import { Migration } from '@mikro-orm/migrations';

export class Migration20220320012939 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "rating" ("id" serial primary key, "title" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "rating" cascade;');
  }

}
