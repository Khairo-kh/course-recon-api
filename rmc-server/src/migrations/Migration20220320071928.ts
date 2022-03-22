import { Migration } from '@mikro-orm/migrations';

export class Migration20220320071928 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "rating" drop constraint if exists "rating_scale_check";');
    this.addSql('alter table "rating" alter column "scale" type real using ("scale"::real);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "rating" drop constraint if exists "rating_scale_check";');
    this.addSql('alter table "rating" alter column "scale" type int4 using ("scale"::int4);');
  }

}
