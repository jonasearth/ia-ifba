import { MigrationInterface, QueryRunner } from 'typeorm';

export class SplitSrlDataToOwnTable1724976029511 implements MigrationInterface {
  name = 'SplitSrlDataToOwnTable1724976029511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "slr-model-data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "slr_model_id" uuid NOT NULL, CONSTRAINT "UQ_e094012e5a932586435f2afe026" UNIQUE ("slr_model_id"), CONSTRAINT "PK_845609380d4b4a6b98bbf5fb3e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "slr-model-data-slr-model-id-relation-idx" ON "slr-model-data" ("slr_model_id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(`ALTER TABLE "slr-model" DROP COLUMN "data"`);
    await queryRunner.query(
      `ALTER TABLE "slr-model-data" ADD CONSTRAINT "FK_e094012e5a932586435f2afe026" FOREIGN KEY ("slr_model_id") REFERENCES "slr-model"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "slr-model-data" DROP CONSTRAINT "FK_e094012e5a932586435f2afe026"`,
    );
    await queryRunner.query(
      `ALTER TABLE "slr-model" ADD "data" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."slr-model-data-slr-model-id-relation-idx"`,
    );
    await queryRunner.query(`DROP TABLE "slr-model-data"`);
  }
}
