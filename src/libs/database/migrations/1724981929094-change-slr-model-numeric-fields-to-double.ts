import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeSlrModelNumericFieldsToDouble1724981929094
  implements MigrationInterface
{
  name = 'ChangeSlrModelNumericFieldsToDouble1724981929094';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "slr-model" DROP COLUMN "intercept"`);
    await queryRunner.query(
      `ALTER TABLE "slr-model" ADD "intercept" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "slr-model" DROP COLUMN "angular_coefficient"`,
    );
    await queryRunner.query(
      `ALTER TABLE "slr-model" ADD "angular_coefficient" double precision NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "slr-model" DROP COLUMN "angular_coefficient"`,
    );
    await queryRunner.query(
      `ALTER TABLE "slr-model" ADD "angular_coefficient" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "slr-model" DROP COLUMN "intercept"`);
    await queryRunner.query(
      `ALTER TABLE "slr-model" ADD "intercept" integer NOT NULL`,
    );
  }
}
