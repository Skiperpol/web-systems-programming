import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1761214815969 implements MigrationInterface {
    name = 'Init1761214815969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL, "name" character varying NOT NULL, "price" numeric NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "warehouses" ("id" uuid NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "capacity" integer NOT NULL, CONSTRAINT "PK_56ae21ee2432b2270b48867e4be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "discounts" ("id" uuid NOT NULL, "name" character varying NOT NULL, "percentage" numeric NOT NULL, "description" character varying NOT NULL, "validFrom" TIMESTAMP NOT NULL, "validTo" TIMESTAMP NOT NULL, CONSTRAINT "PK_66c522004212dc814d6e2f14ecc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "discounts"`);
        await queryRunner.query(`DROP TABLE "warehouses"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
