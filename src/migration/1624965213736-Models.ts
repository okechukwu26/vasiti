import {MigrationInterface, QueryRunner} from "typeorm";

export class Models1624965213736 implements MigrationInterface {
    name = 'Models1624965213736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bookings` ADD `amount` int NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bookings` DROP COLUMN `amount`");
    }

}
