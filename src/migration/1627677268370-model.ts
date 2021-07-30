import {MigrationInterface, QueryRunner} from "typeorm";

export class model1627677268370 implements MigrationInterface {
    name = 'model1627677268370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bookings` ADD `DepartureTerminal` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `bookings` ADD `ArrivalTerminal` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bookings` DROP COLUMN `ArrivalTerminal`");
        await queryRunner.query("ALTER TABLE `bookings` DROP COLUMN `DepartureTerminal`");
    }

}
