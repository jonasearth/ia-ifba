import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNeuralNetworkTable1725577767927
  implements MigrationInterface
{
  name = 'UpdateNeuralNetworkTable1725577767927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "neural_networks" ADD "status" character varying NOT NULL DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "neural_networks" DROP COLUMN "status"`,
    );
  }
}
