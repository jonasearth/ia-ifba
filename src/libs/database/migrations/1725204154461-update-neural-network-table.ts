import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNeuralNetworkTable1725204154461 implements MigrationInterface {
    name = 'UpdateNeuralNetworkTable1725204154461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "neural_networks" DROP COLUMN "hidden_layer_node_size"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "neural_networks" ADD "hidden_layer_node_size" integer NOT NULL`);
    }

}
