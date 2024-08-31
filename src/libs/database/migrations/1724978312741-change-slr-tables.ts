import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeSlrTables1724978312741 implements MigrationInterface {
  name = 'ChangeSlrTables1724978312741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "slr-model-data" DROP COLUMN "data"`);
    await queryRunner.query(
      `ALTER TABLE "slr-model-data" ADD "x" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "slr-model-data" ADD "y" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "slr-model" ADD "x_key" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "slr-model" ADD "y_key" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "slr-model" DROP COLUMN "y_key"`);
    await queryRunner.query(`ALTER TABLE "slr-model" DROP COLUMN "x_key"`);
    await queryRunner.query(`ALTER TABLE "slr-model-data" DROP COLUMN "y"`);
    await queryRunner.query(`ALTER TABLE "slr-model-data" DROP COLUMN "x"`);
    await queryRunner.query(
      `ALTER TABLE "slr-model-data" ADD "data" jsonb NOT NULL`,
    );
  }
}
