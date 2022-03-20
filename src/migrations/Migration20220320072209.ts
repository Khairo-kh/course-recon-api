import { Migration } from '@mikro-orm/migrations';

export class Migration20220320072209 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "rating" drop constraint if exists "rating_created_at_check";');
    this.addSql('alter table "rating" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "rating" alter column "created_at" set default \'NOW()\';');
    this.addSql('alter table "rating" drop constraint if exists "rating_updated_at_check";');
    this.addSql('alter table "rating" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
    this.addSql('alter table "rating" alter column "updated_at" set default \'NOW()\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "rating" drop constraint if exists "rating_created_at_check";');
    this.addSql('alter table "rating" alter column "created_at" drop default;');
    this.addSql('alter table "rating" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "rating" drop constraint if exists "rating_updated_at_check";');
    this.addSql('alter table "rating" alter column "updated_at" drop default;');
    this.addSql('alter table "rating" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
  }

}
