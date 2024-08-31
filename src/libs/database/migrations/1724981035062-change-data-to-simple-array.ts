import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDataToSimpleArray1724981035062 implements MigrationInterface {
    name = 'ChangeDataToSimpleArray1724981035062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "slr-model-data" DROP COLUMN "x"`);
        await queryRunner.query(`ALTER TABLE "slr-model-data" ADD "x" numeric array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "slr-model-data" DROP COLUMN "y"`);
        await queryRunner.query(`ALTER TABLE "slr-model-data" ADD "y" numeric array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "slr-model-data" DROP COLUMN "y"`);
        await queryRunner.query(`ALTER TABLE "slr-model-data" ADD "y" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "slr-model-data" DROP COLUMN "x"`);
        await queryRunner.query(`ALTER TABLE "slr-model-data" ADD "x" jsonb NOT NULL`);
    }

}
