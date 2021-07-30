import {MigrationInterface, QueryRunner} from "typeorm";

export class depart1627678978571 implements MigrationInterface {
    name = 'depart1627678978571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bookings` DROP COLUMN `time`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bookings` ADD `time` varchar(255) NOT NULL");
    }

}
