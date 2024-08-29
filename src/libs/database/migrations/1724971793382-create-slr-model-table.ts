import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSlrModelTable1724971793382 implements MigrationInterface {
  name = 'CreateSlrModelTable1724971793382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "slr-model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "intercept" integer NOT NULL, "angular_coefficient" integer NOT NULL, "data" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_9e8e5cb41035d05b8f68ab775f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "slr-model-name-idx" ON "slr-model" ("name") WHERE "deleted_at" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."slr-model-name-idx"`);
    await queryRunner.query(`DROP TABLE "slr-model"`);
  }
}
