import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNeuralNetworksTable1725200767201
  implements MigrationInterface
{
  name = 'CreateNeuralNetworksTable1725200767201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "neural_networks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "learning_type" character varying NOT NULL, "hidden_layer_node_size" integer NOT NULL, "data" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a0eb8feab1c39e8ead52a9afcf7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "neural-network-name-idx" ON "neural_networks" ("name") WHERE "deleted_at" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."neural-network-name-idx"`);
    await queryRunner.query(`DROP TABLE "neural_networks"`);
  }
}
