import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1740197792228 implements MigrationInterface {
  name = 'FirstMigration1740197792228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'CHECKING')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(45), "email" character varying(45) NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT 'CHECKING', "emailVerifiedAt" TIMESTAMP WITH TIME ZONE, "accessCode" character varying(8), "accessCodeExpiration" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favorites" ("id" SERIAL NOT NULL, "favoritedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "video_id" integer, CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."video_status_enum" AS ENUM('PROCESSING', 'PROCESSED', 'FAILED', 'SCHEDULED', 'NOT_PROCESSED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "video" ("id" SERIAL NOT NULL, "youtubeId" character varying(11) NOT NULL, "title" character varying(140) NOT NULL, "description" text, "url" character varying(100) NOT NULL, "durationInSeconds" integer NOT NULL, "category" character varying(20) NOT NULL, "uploadDate" TIMESTAMP NOT NULL, "thumbnail" character varying(180) NOT NULL, "status" "public"."video_status_enum" NOT NULL DEFAULT 'SCHEDULED', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "requestedBy" integer NOT NULL, "author_id" integer, CONSTRAINT "UQ_fc6cf858b85534c688d43de1837" UNIQUE ("youtubeId"), CONSTRAINT "UQ_9c4f2325dcc478a7691292bb8df" UNIQUE ("url"), CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id")); COMMENT ON COLUMN "video"."youtubeId" IS 'The video id on youtube'`,
    );
    await queryRunner.query(
      `CREATE TABLE "author" ("id" SERIAL NOT NULL, "youtubeId" character varying(24) NOT NULL, "name" character varying(60) NOT NULL, "avatar" character varying(180) NOT NULL, "channelUrl" character varying(110) NOT NULL, "user" character varying(30) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_aa2714b59449f5fa69dda7e55c5" UNIQUE ("youtubeId"), CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_525aab753d0c04e6ed0a780030a" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "video" ADD CONSTRAINT "FK_aec7e02c1dee53cdfd032df1499" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "video" DROP CONSTRAINT "FK_aec7e02c1dee53cdfd032df1499"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_525aab753d0c04e6ed0a780030a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593"`,
    );
    await queryRunner.query(`DROP TABLE "author"`);
    await queryRunner.query(`DROP TABLE "video"`);
    await queryRunner.query(`DROP TYPE "public"."video_status_enum"`);
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
  }
}
